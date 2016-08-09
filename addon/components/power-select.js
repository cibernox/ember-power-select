import Component from 'ember-component';
import layout from '../templates/components/power-select';
import fallbackIfUndefined from '../utils/computed-fallback-if-undefined';
import { assert } from 'ember-metal/utils';
import { isBlank } from 'ember-utils';
import { isEmberArray } from 'ember-array/utils';
import computed from 'ember-computed';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { scheduleOnce, debounce, cancel } from 'ember-runloop';
import { defaultMatcher, indexOfOption, optionAtIndex, filterOptions, countOptions } from '../utils/group-utils';

// Copied from Ember. It shouldn't be necessary in Ember 2.5+
const assign = Object.assign || function EmberAssign(original, ...args) {
  for (let i = 0; i < args.length; i++) {
    let arg = args[i];
    if (!arg) { continue; }

    let updates = Object.keys(arg);

    for (let i = 0; i < updates.length; i++) {
      let prop = updates[i];
      original[prop] = arg[prop];
    }
  }

  return original;
};

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

const initialState = {
  options: [],              // Contains the resolved collection of options
  results: [],              // Contains the active set of results
  resultsCount: 0,          // Contains the number of results incuding those nested/disabled
  selected: undefined,      // Contains the resolved selected option
  highlighted: undefined,   // Contains the currently highlighted option (if any)
  searchText: '',           // Contains the text of the current search
  lastSearchedText: '',     // Contains the text of the last finished search
  loading: false,           // Truthy if there is a pending promise that will update the results
  isActive: false,          // Truthy if the trigger is focused. Other subcomponents can mark it as active depending on other logic.
  // Private API (for now)
  _expirableSearchText: '',
  _activeSearch: null,
};

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
  searchMessageComponent: fallbackIfUndefined('power-select/search-message'),

  // Private state
  expirableSearchDebounceId: null,
  publicAPI: initialState,

  // Lifecycle hooks
  init() {
    this._super(...arguments);
    this._publicAPIActions = {
      search: (...args) => this.send('search', ...args),
      highlight: (...args) => this.send('highlight', ...args),
      select: (...args) => this.send('select', ...args),
      choose: (...args) => this.send('choose', ...args),
      scrollTo: (...args) => scheduleOnce('afterRender', this, this.send, 'scrollTo', ...args)
    };
    assert('{{power-select}} requires an `onchange` function', this.get('onchange') && typeof this.get('onchange') === 'function');
  },

  willDestroy() {
    this._super(...arguments);
    this.activeSelectedPromise = this.activeOptionsPromise = null;
    let publicAPI = this.get('publicAPI');
    if (publicAPI.options && publicAPI.options.removeObserver) {
      publicAPI.options.removeObserver('[]', this, this._updateOptionsAndResults);
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
    set(_, options, oldOptions) {
      if (options === oldOptions) {
        return options;
      }
      if (options && options.then) {
        this.updateState({ loading: true });
        this.activeOptionsPromise = options;
        options.then(resolvedOptions => {
          if (this.activeOptionsPromise === options) {
            this.updateOptions(resolvedOptions);
          }
        }, () => {
          if (this.activeOptionsPromise === options) {
            this.updateState({ loading: false });
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
    let publicAPI = this.get('publicAPI');
    return publicAPI.searchText.length === 0 &&
      !!this.get('search') && !!this.get('searchMessage') &&
      publicAPI.resultsCount === 0;
  }),

  mustShowNoMessages: computed('search', 'publicAPI.{lastSearchedText,resultsCount,loading}', function() {
    let publicAPI = this.get('publicAPI');
    return !publicAPI.loading &&
      publicAPI.resultsCount === 0 &&
      (!this.get('search') || publicAPI.lastSearchedText.length > 0);
  }),

  // Actions
  actions: {
    registerAPI(dropdown) {
      let publicAPI = assign({}, this.get('publicAPI'), dropdown);
      publicAPI.actions = assign({}, dropdown.actions, this._publicAPIActions);
      this.setProperties({
        publicAPI: publicAPI,
        optionsId: `ember-power-select-options-${publicAPI._id}`
      });
      let action = this.get('registerAPI');
      if (action) {
        action(publicAPI);
      }
    },

    onOpen(_, e) {
      let action = this.get('onopen');
      if (action && action(this.get('publicAPI'), e) === false) {
        return false;
      }
      if (e) {
        this.openingEvent = e;
        if (e.type === 'keydown' && (e.keyCode === 38 || e.keyCode === 40)) {
          e.preventDefault();
        }
      }
      this.resetHighlighted();
    },

    onClose(_, e) {
      let action = this.get('onclose');
      if (action && action(this.get('publicAPI'), e) === false) {
        return false;
      }
      if (e) { this.openingEvent = null; }
      this.updateState({ highlighted: undefined });
    },

    onInput(e) {
      let term = e.target.value;
      let action = this.get('oninput');
      let publicAPI = this.get('publicAPI');
      if (action && action(term, publicAPI, e) === false) {
        return;
      }
      publicAPI.actions.search(term);
    },

    highlight(option /*, e */) {
      if (option && get(option, 'disabled')) { return; }
      this.updateState({ highlighted: option });
    },

    select(selected /*, e */) {
      let publicAPI = this.get('publicAPI');
      if (publicAPI.selected !== selected) {
        this.get('onchange')(selected, publicAPI);
      }
    },

    search(term) {
      if (isBlank(term)) {
        this._resetSearch();
      } else if (this.get('search')) {
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
      let publicAPI = this.get('publicAPI');
      publicAPI.actions.select(this.get('buildSelection')(selected, publicAPI), e);
      if (this.get('closeOnSelect')) {
        publicAPI.actions.close(e);
        return false;
      }
    },

    // keydowns handled by the trigger provided by ember-basic-dropdown
    onTriggerKeydown(_, e) {
      let onkeydown = this.get('onkeydown');
      if (onkeydown && onkeydown(this.get('publicAPI'), e) === false) {
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
      if (onkeydown && onkeydown(this.get('publicAPI'), e) === false) {
        return false;
      }
      return this._routeKeydown(e);
    },

    // keyups handled by inputs inside the component
    onKeyup(e) {
      let onkeyup = this.get('onkeyup');
      if (onkeyup) {
        onkeyup(this.get('publicAPI'), e);
      }
    },

    scrollTo(option /*, e */) {
      if (!self.document || !option) { return; }
      let optionsList = self.document.querySelector('.ember-power-select-options');
      if (!optionsList) { return; }
      let index = indexOfOption(this.get('publicAPI').results, option);
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
        action(this.get('publicAPI'), event);
      }
    },

    onFocus(event) {
      this.send('activate');
      let action = this.get('onfocus');
      if (action) {
        action(this.get('publicAPI'), event);
      }
    },

    activate() {
      this.updateState({ isActive: true });
    },

    deactivate() {
      this.updateState({ isActive: false });
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
    } else if (selection !== this.get('publicAPI').selected) {
      this.updateState({ selected: selection, highlighted: selection });
    }
  },

  resetHighlighted() {
    let publicAPI = this.get('publicAPI');
    let highlighted = defaultHighlighted(publicAPI.results, publicAPI.highlighted || publicAPI.selected);
    this.updateState({ highlighted });
  },

  buildSelection(option /*, select */) {
    return option;
  },

  _updateOptionsAndResults(opts) {
    if (get(this, 'isDestroyed')) { return; }
    let options = toPlainArray(opts);
    let publicAPI;
    if (this.get('search')) { // external search
      publicAPI = this.updateState({ options, results: options, resultsCount: countOptions(options), loading: false });
    } else { // filter
      publicAPI = this.get('publicAPI');
      let results = isBlank(publicAPI.searchText) ? options : this.filter(options, publicAPI.searchText);
      publicAPI = this.updateState({ results, options, resultsCount: countOptions(results), loading: false });
    }
    if (publicAPI.isOpen) {
      this.resetHighlighted();
    }
  },

  _updateSelectedArray(selection) {
    if (get(this, 'isDestroyed')) { return; }
    this.updateState({ selected: toPlainArray(selection) });
  },

  _resetSearch() {
    let results = this.get('publicAPI').options;
    this.updateState({
      results,
      searchText: '',
      lastSearchedText: '',
      resultsCount: countOptions(results),
      loading: false,
      _activeSearch: null
    });
  },

  _performFilter(term) {
    let results = this.filter(this.get('publicAPI').options, term);
    this.updateState({ results, searchText: term, lastSearchedText: term, resultsCount: countOptions(results) });
    this.resetHighlighted();
  },

  _performSearch(term) {
    let searchAction = this.get('search');
    let publicAPI = this.updateState({ searchText: term });
    let search = searchAction(term, publicAPI);
    if (!search) {
      publicAPI = this.updateState({ lastSearchedText: term });
    } else if (search.then) {
      publicAPI = this.updateState({ loading: true, _activeSearch: search });
      search.then((results) => {
        if (this.get('isDestroyed')) { return; }
        if (this.get('publicAPI')._activeSearch === search) {
          let resultsArray = toPlainArray(results);
          this.updateState({
            results: resultsArray,
            lastSearchedText: term,
            resultsCount: countOptions(results),
            loading: false
          });
          this.resetHighlighted();
        }
      }, () => {
        if (this.get('isDestroyed')) { return; }
        if (this.get('publicAPI')._activeSearch === search) {
          this.updateState({ lastSearchedText: term, loading: false });
        }
      });
    } else {
      let resultsArray = toPlainArray(search);
      this.updateState({ results: resultsArray, lastSearchedText: term, resultsCount: countOptions(resultsArray) });
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
    let publicAPI = this.get('publicAPI');
    if (publicAPI.isOpen) {
      e.preventDefault();
      e.stopPropagation();
      let step = e.keyCode === 40 ? 1 : -1;
      let newHighlighted = advanceSelectableOption(publicAPI.results, publicAPI.highlighted, step);
      publicAPI.actions.highlight(newHighlighted, e);
      publicAPI.actions.scrollTo(newHighlighted);
    } else {
      publicAPI.actions.open(e);
    }
  },

  _handleKeyEnter(e) {
    let publicAPI = this.get('publicAPI');
    if (publicAPI.isOpen && publicAPI.highlighted !== undefined) {
      publicAPI.actions.choose(publicAPI.highlighted, e);
      return false;
    }
  },

  _handleKeySpace(e) {
    let publicAPI = this.get('publicAPI');
    if (publicAPI.isOpen && publicAPI.highlighted !== undefined) {
      publicAPI.actions.choose(publicAPI.highlighted, e);
      return false;
    }
  },

  _handleKeyTab(e) {
    this.get('publicAPI').actions.close(e);
  },

  _handleKeyESC(e) {
    this.get('publicAPI').actions.close(e);
  },

  _handleTriggerTyping(e) {
    let publicAPI = this.get('publicAPI');
    let term = publicAPI._expirableSearchText + String.fromCharCode(e.keyCode);
    this.updateState({ _expirableSearchText: term });
    this.expirableSearchDebounceId = debounce(this, this.updateState, { _expirableSearchText: '' }, 1000);
    let matches = this.filter(publicAPI.options, term, true);
    if (get(matches, 'length') === 0) {
      return;
    }
    let firstMatch = optionAtIndex(matches, 0);
    if (firstMatch !== undefined) {
      if (publicAPI.isOpen) {
        publicAPI.actions.highlight(firstMatch.option, e);
        publicAPI.actions.scrollTo(firstMatch.option, e);
      } else {
        publicAPI.actions.select(firstMatch.option, e);
      }
    }
  },

  updateState(changes) {
    let newState = set(this, 'publicAPI', assign({}, this.get('publicAPI'), changes));
    let registerAPI = this.get('registerAPI');
    if (registerAPI) {
      registerAPI(newState);
    }
    return newState;
  }
});
