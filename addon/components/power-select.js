import Component from 'ember-component';
import layout from '../templates/components/power-select';
import fallbackIfUndefined from '../utils/computed-fallback-if-undefined';
import { assign } from 'ember-platform';
import { assert } from 'ember-metal/utils';
import { isBlank } from 'ember-utils';
import { isEmberArray } from 'ember-array/utils';
import computed from 'ember-computed';
import get from 'ember-metal/get';
import set, { setProperties } from 'ember-metal/set';
import { scheduleOnce, debounce, cancel } from 'ember-runloop';
import { defaultMatcher, indexOfOption, optionAtIndex, filterOptions, countOptions } from '../utils/group-utils';

function concatWithProperty(strings, property) {
  if (property) { strings.push(property); }
  return strings.join(' ');
}

function defaultHighlighted(results, selected) {
  if (selected === undefined || indexOfOption(results, selected) === -1) {
    return advanceSelectableOption(results, selected, 1);
  }
  return selected;
}

function advanceSelectableOption(options, currentOption, step) {
  let resultsLength = countOptions(options);
  let startIndex = Math.min(Math.max(indexOfOption(options, currentOption) + step, 0), resultsLength - 1);
  let { disabled, option } = optionAtIndex(options, startIndex);
  while (option && disabled) {
    let next = optionAtIndex(options, startIndex += step);
    disabled = next.disabled;
    option = next.option;
  }
  return option;
}

function toPlainArray(collection) {
  return collection.toArray ? collection.toArray() : collection;
}

export default Component.extend({
  // HTML
  layout,
  tagName: '',

  // Options
  searchEnabled: fallbackIfUndefined(true),
  matchTriggerWidth: fallbackIfUndefined(true),
  matcher: fallbackIfUndefined(defaultMatcher),
  loadingMessage: fallbackIfUndefined('Loading options...'),
  noMatchesMessage: fallbackIfUndefined('No results found'),
  searchMessage: fallbackIfUndefined("Type to search"),
  closeOnSelect: fallbackIfUndefined(true),

  afterOptionsComponent: fallbackIfUndefined(null),
  beforeOptionsComponent: fallbackIfUndefined('power-select/before-options'),
  optionsComponent: fallbackIfUndefined('power-select/options'),
  selectedItemComponent: fallbackIfUndefined(null),
  triggerComponent: fallbackIfUndefined('power-select/trigger'),

  // Private state
  expirableSearchText: '',
  expirableSearchDebounceId: null,
  activeSearch: null,
  publicAPI: {
    options: [],              // Contains the resolved collection of options
    results: [],              // Contains the active set of results
    resultsCount: 0,          // Contains the number of results incuding those nested/disabled
    selected: undefined,      // Contains the resolved selected option
    highlighted: undefined,   // Contains the currently highlighted option (if any)
    searchText: '',           // Contains the text of the current search
    lastSearchedText: '',     // Contains the text of the last finished search
    loading: false,           // Truthy if there is a pending promise that will update the results
    isActive: false           // Truthy if the trigger is focused. Other subcomponents can mark it as active depending on other logic.
  },

  // Lifecycle hooks
  init() {
    this._super(...arguments);
    assert('{{power-select}} requires an `onchange` function', this.get('onchange') && typeof this.get('onchange') === 'function');
  },

  willDestroy() {
    this._super(...arguments);
    this.activeSearch = this.activeSelectedPromise = this.activeOptionsPromise = null;
    if (this.publicAPI.options && this.publicAPI.options.removeObserver) {
      this.publicAPI.options.removeObserver('[]', this, this._updateOptionsAndResults);
    }
    cancel(this.expirableSearchDebounceId);
  },

  // CPs
  selected: computed({
    get() { return null; },
    set(_, selected) {
      if (selected && selected.then) {
        this.activeSelectedPromise = selected;
        selected.then(selection => {
          if (this.activeSelectedPromise === selected) {
            this.updateSelection(selection);
          }
        });
      } else {
        scheduleOnce('actions', this, this.updateSelection, selected);
      }
      return selected;
    }
  }),

  options: computed({
    get() { return []; },
    set(_, options) {
      if (options && options.then) {
        set(this.publicAPI, 'loading', true);
        this.activeOptionsPromise = options;
        options.then(resolvedOptions => {
          if (this.activeOptionsPromise === options) {
            this.updateOptions(resolvedOptions);
          }
        }, () => {
          if (this.activeOptionsPromise === options) {
            set(this.publicAPI, 'loading', false);
          }
        });
      } else {
        scheduleOnce('actions', this, this.updateOptions, options);
      }
      return options;
    }
  }),

  optionMatcher: computed('searchField', 'matcher', function() {
    let { matcher, searchField } = this.getProperties('matcher', 'searchField');
    if (searchField && matcher === defaultMatcher) {
      return (option, text) => matcher(get(option, searchField), text);
    } else {
      return (option, text) => matcher(option, text);
    }
  }),

  concatenatedTriggerClasses: computed('triggerClass', 'publicAPI.isActive', function() {
    let classes = ['ember-power-select-trigger'];
    if (this.get('publicAPI.isActive')) {
      classes.push('ember-power-select-trigger--active');
    }
    return concatWithProperty(classes, this.get('triggerClass'));
  }),

  concatenatedDropdownClasses: computed('dropdownClass', 'publicAPI.isActive', function() {
    let classes = ['ember-power-select-dropdown'];
    if (this.get('publicAPI.isActive')) {
      classes.push('ember-power-select-dropdown--active');
    }
    return concatWithProperty(classes, this.get('dropdownClass'));
  }),

  mustShowSearchMessage: computed('publicAPI.{searchText,resultsCount}', 'search', 'searchMessage', function(){
    return this.publicAPI.searchText.length === 0 &&
      !!this.get('search') && !!this.get('searchMessage') &&
      this.publicAPI.resultsCount === 0;
  }),

  mustShowNoMessages: computed('search', 'publicAPI.{lastSearchedText,resultsCount,loading}', function() {
    return !this.publicAPI.loading &&
      this.publicAPI.resultsCount === 0 &&
      (!this.get('search') || this.publicAPI.lastSearchedText.length > 0);
  }),

  // Actions
  actions: {
    registerAPI(dropdown) {
      let actions = {
        search: (...args) => this.send('search', ...args),
        highlight: (...args) => this.send('highlight', ...args),
        select: (...args) => this.send('select', ...args),
        choose: (...args) => this.send('choose', ...args),
        scrollTo: (...args) => scheduleOnce('afterRender', this, this.send, 'scrollTo', ...args)
      };
      assign(dropdown.actions, actions);
      assign(dropdown, this.publicAPI);
      this.publicAPI = dropdown;
      this.set('optionsId', `ember-power-select-options-${dropdown._id}`);
      let action = this.get('registerAPI');
      if (action) {
        action(dropdown);
      }
    },

    onOpen(_, e) {
      let action = this.get('onopen');
      if (action && action(this.publicAPI, e) === false) {
        return false;
      }
      if (e) { this.openingEvent = e; }
      this.resetHighlighted();
    },

    onClose(_, e) {
      let action = this.get('onclose');
      if (action && action(this.publicAPI, e) === false) {
        return false;
      }
      if (e) { this.openingEvent = null; }
      set(this.publicAPI, 'highlighted', undefined);
    },

    onInput(e) {
      let term = e.target.value;
      let action = this.get('oninput');
      if (action && action(term, this.publicAPI, e) === false) {
        return;
      }
      this.publicAPI.actions.search(term);
    },

    highlight(option /*, e */) {
      if (option && get(option, 'disabled')) { return; }
      set(this.publicAPI, 'highlighted', option);
    },

    select(selected /*, e */) {
      if (this.publicAPI.selected !== selected) {
        this.get('onchange')(selected, this.publicAPI);
      }
    },

    search(term) {
      if (isBlank(term)) {
        this._resetSearch();
      } else if (this.getAttr('search')) {
        this._performSearch(term);
      } else {
        this._performFilter(term);
      }
    },

    choose(selected, e) {
      if (e && e.clientY) {
        if (this.openingEvent && this.openingEvent.clientY) {
          if (Math.abs(this.openingEvent.clientY - e.clientY) < 2) { return; }
        }
      }
      this.publicAPI.actions.select(this.get('buildSelection')(selected, this.publicAPI), e);
      if (this.get('closeOnSelect')) {
        this.publicAPI.actions.close(e);
        return false;
      }
    },

    // keydowns handled by the trigger provided by ember-basic-dropdown
    onTriggerKeydown(_, e) {
      let onkeydown = this.get('onkeydown');
      if (onkeydown && onkeydown(this.publicAPI, e) === false) {
        return false;
      }
      if (e.keyCode >= 48 && e.keyCode <= 90) { // Keys 0-9, a-z or SPACE
        return this._handleTriggerTyping(e);
      } else if (e.keyCode === 32) {  // Space
        return this._handleKeySpace(e);
      } else {
        return this._routeKeydown(e);
      }
    },

    // keydowns handled by inputs inside the component
    onKeydown(e) {
      let onkeydown = this.get('onkeydown');
      if (onkeydown && onkeydown(this.publicAPI, e) === false) {
        return false;
      }
      return this._routeKeydown(e);
    },

    scrollTo(option /*, e */) {
      if (!self.document || !option) { return; }
      let optionsList = self.document.querySelector('.ember-power-select-options');
      if (!optionsList) { return; }
      let index = indexOfOption(this.publicAPI.results, option);
      if (index === -1) { return; }
      let optionElement = optionsList.querySelectorAll('[data-option-index]').item(index);
      let optionTopScroll = optionElement.offsetTop - optionsList.offsetTop;
      let optionBottomScroll = optionTopScroll + optionElement.offsetHeight;
      if (optionBottomScroll > optionsList.offsetHeight + optionsList.scrollTop) {
        optionsList.scrollTop = optionBottomScroll - optionsList.offsetHeight;
      } else if (optionTopScroll < optionsList.scrollTop) {
        optionsList.scrollTop = optionTopScroll;
      }
    },

    onTriggerFocus(_, event) {
      this.send('activate');
      let action = this.get('onfocus');
      if (action) {
        action(this.publicAPI, event);
      }
    },

    onFocus(event) {
      this.send('activate');
      let action = this.get('onfocus');
      if (action) {
        action(this.publicAPI, event);
      }
    },

    activate() {
      set(this.publicAPI, 'isActive', true);
    },

    deactivate() {
      set(this.publicAPI, 'isActive', false);
    }
  },

  // Methods
  filter(options, term, skipDisabled = false) {
    return filterOptions(options || [], term, this.get('optionMatcher'), skipDisabled);
  },

  updateOptions(options) {
    if (!options) {
      return;
    }
    if (options && options.addObserver) {
      options.addObserver('[]', this, this._updateOptionsAndResults);
    }
    this._updateOptionsAndResults(options);
  },

  updateSelection(selection) {
    if (isEmberArray(selection)) {
      if (selection && selection.addObserver) {
        selection.addObserver('[]', this, this._updateSelectedArray);
      }
      this._updateSelectedArray(selection);
    } else if (selection !== this.publicAPI.selected) {
      setProperties(this.publicAPI, { selected: selection, highlighted: selection });
    }
  },

  resetHighlighted() {
    let highlighted = defaultHighlighted(this.publicAPI.results, this.publicAPI.highlighted || this.publicAPI.selected);
    set(this.publicAPI, 'highlighted', highlighted);
  },

  buildSelection(option /*, select */) {
    return option;
  },

  _updateOptionsAndResults(opts) {
    if (get(this, 'isDestroyed')) { return; }
    let options = toPlainArray(opts);
    if (this.getAttr('search')) { // external search
      setProperties(this.publicAPI, { options, results: options, resultsCount: countOptions(options), loading: false });
    } else { // filter
      let results = isBlank(this.publicAPI.searchText) ? options : this.filter(options, this.publicAPI.searchText);
      setProperties(this.publicAPI, { results, options, resultsCount: countOptions(results), loading: false });
      if (this.publicAPI.isOpen) {
        this.resetHighlighted();
      }
    }
  },

  _updateSelectedArray(selection) {
    if (get(this, 'isDestroyed')) { return; }
    set(this.publicAPI, 'selected', toPlainArray(selection));
  },

  _resetSearch() {
    let results = this.publicAPI.options;
    this.activeSearch = null;
    setProperties(this.publicAPI, {
      results,
      searchText: '',
      lastSearchedText: '',
      resultsCount: countOptions(results),
      loading: false
    });
  },

  _performFilter(term) {
    let results = this.filter(this.publicAPI.options, term);
    setProperties(this.publicAPI, { results, searchText: term, lastSearchedText: term, resultsCount: countOptions(results) });
    this.resetHighlighted();
  },

  _performSearch(term) {
    let searchAction = this.getAttr('search');
    set(this.publicAPI, 'searchText', term);
    let search = searchAction(term, this.publicAPI);
    if (!search) {
      set(this.publicAPI, 'lastSearchedText', term);
    } else if (search.then) {
      set(this.publicAPI, 'loading', true);
      this.activeSearch = search;
      search.then((results) => {
        if (this.activeSearch === search) {
          let resultsArray = toPlainArray(results);
          setProperties(this.publicAPI, {
            results: resultsArray,
            lastSearchedText: term,
            resultsCount: countOptions(results),
            loading: false
          });
          this.resetHighlighted();
        }
      }, () => {
        if (this.activeSearch === search) {
          setProperties(this.publicAPI, { lastSearchedText: term, loading: false });
        }
      });
    } else {
      let resultsArray = toPlainArray(search);
      setProperties(this.publicAPI, { results: resultsArray, lastSearchedText: term, resultsCount: countOptions(resultsArray) });
      this.resetHighlighted();
    }
  },

  _routeKeydown(e) {
    if (e.keyCode === 38 || e.keyCode === 40) { // Up & Down
      return this._handleKeyUpDown(e);
    } else if (e.keyCode === 13) {  // ENTER
      return this._handleKeyEnter(e);
    } else if (e.keyCode === 9) {   // Tab
      return this._handleKeyTab(e);
    } else if (e.keyCode === 27) {  // ESC
      return this._handleKeyESC(e);
    }
  },

  _handleKeyUpDown(e) {
    if (this.publicAPI.isOpen) {
      e.preventDefault();
      e.stopPropagation();
      let step = e.keyCode === 40 ? 1 : -1;
      let newHighlighted = advanceSelectableOption(this.publicAPI.results, this.publicAPI.highlighted, step);
      this.publicAPI.actions.highlight(newHighlighted, e);
      this.publicAPI.actions.scrollTo(newHighlighted);
    } else {
      this.publicAPI.actions.open(e);
    }
  },

  _handleKeyEnter(e) {
    if (this.publicAPI.isOpen && this.publicAPI.highlighted !== undefined) {
      this.publicAPI.actions.choose(this.publicAPI.highlighted, e);
      return false;
    }
  },

  _handleKeySpace(e) {
    if (this.publicAPI.isOpen && this.publicAPI.highlighted !== undefined) {
      this.publicAPI.actions.choose(this.publicAPI.highlighted, e);
      return false;
    }
  },

  _handleKeyTab(e) {
    this.publicAPI.actions.close(e);
  },

  _handleKeyESC(e) {
    this.publicAPI.actions.close(e);
  },

  _handleTriggerTyping(e) {
    let term = this.expirableSearchText + String.fromCharCode(e.keyCode);
    this.expirableSearchText = term;
    this.expirableSearchDebounceId = debounce(this, 'set', 'expirableSearchText', '', 1000);
    let matches = this.filter(this.publicAPI.options, term, true);
    if (get(matches, 'length') === 0) {
      return;
    }
    let firstMatch = optionAtIndex(matches, 0);
    if (firstMatch !== undefined) {
      if (this.publicAPI.isOpen) {
        this.publicAPI.actions.highlight(firstMatch.option, e);
        this.publicAPI.actions.scrollTo(firstMatch.option, e);
      } else {
        this.publicAPI.actions.select(firstMatch.option, e);
      }
    }
  }
});
