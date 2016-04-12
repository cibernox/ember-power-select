import Ember from 'ember';
import layout from '../templates/components/power-select';
import { defaultMatcher, indexOfOption, optionAtIndex, filterOptions, countOptions } from '../utils/group-utils';
import fallbackIfUndefined from '../utils/computed-fallback-if-undefined';

const { computed, run, get, isBlank } = Ember;
const EventSender = Ember.Object.extend(Ember.Evented);
const assign = Ember.assign || Ember.merge;
function concatWithProperty(strings, property) {
  if (property) { strings.push(property); }
  return strings.join(' ');
}

export default Ember.Component.extend({
  // HTML
  layout,
  tagName: fallbackIfUndefined(''),

  // Config
  disabled: fallbackIfUndefined(false),
  placeholder: fallbackIfUndefined(null),
  loadingMessage: fallbackIfUndefined('Loading options...'),
  noMatchesMessage: fallbackIfUndefined('No results found'),
  verticalPosition: fallbackIfUndefined('auto'),
  horizontalPosition: fallbackIfUndefined('auto'),
  matcher: fallbackIfUndefined(defaultMatcher),
  searchField: fallbackIfUndefined(null),
  search: fallbackIfUndefined(null),
  closeOnSelect: fallbackIfUndefined(true),
  dropdownClass: fallbackIfUndefined(null),
  triggerClass: fallbackIfUndefined(null),
  dir: fallbackIfUndefined(null),
  initiallyOpened: fallbackIfUndefined(false),
  searchEnabled: fallbackIfUndefined(true),
  searchMessage: fallbackIfUndefined("Type to search"),
  searchPlaceholder: fallbackIfUndefined(null),
  allowClear: fallbackIfUndefined(false),
  triggerComponent: fallbackIfUndefined('power-select/trigger'),
  selectedItemComponent: fallbackIfUndefined(null),
  optionsComponent: fallbackIfUndefined('power-select/options'),
  beforeOptionsComponent: fallbackIfUndefined('power-select/before-options'),
  afterOptionsComponent: fallbackIfUndefined(null),
  matchTriggerWidth: fallbackIfUndefined(true),

  // Attrs
  searchText: '',
  lastSearchedText: '',
  expirableSearchText: '',
  activeSearch: null,
  openingEvent: null,
  loading: false,
  previousResults: null,

  // Lifecycle hooks
  didInitAttrs() {
    this._super(...arguments);
    Ember.assert('{{power-select}} requires an `onchange` function', this.get('onchange') && typeof this.get('onchange') === 'function');
  },

  willDestroy() {
    this._super(...arguments);
    this.activeSearch = null;
    run.cancel(this.expirableSearchDebounceId);
  },

  // CPs
  triggerId: computed(function() {
    return `ember-power-select-trigger-${this.elementId}`;
  }),

  optionsId: computed(function() {
    return `ember-power-select-options-${this.elementId}`;
  }),

  concatenatedClasses: computed('class', function() {
    return concatWithProperty(['ember-power-select'], this.get('class'));
  }),

  concatenatedTriggerClasses: computed('triggerClass', function() {
    return concatWithProperty(['ember-power-select-trigger'], this.get('triggerClass'));
  }),

  concatenatedDropdownClasses: computed('dropdownClass', function() {
    return concatWithProperty(
      ['ember-power-select-dropdown', `ember-power-select-dropdown-${this.elementId}`],
      this.get('dropdownClass')
    );
  }),

  mustShowSearchMessage: computed('searchText', 'search', 'searchMessage', 'results.length', function(){
    return this.get('searchText.length') === 0 && !!this.get('search') && !!this.get('searchMessage') && this.get('results.length') === 0;
  }),

  mustShowNoMessages: computed('results.length', 'loading', 'search', 'lastSearchedText', function() {
    return !this.get('loading') && this.get('results.length') === 0 && (!this.get('search') || this.get('lastSearchedText.length') > 0);
  }),

  results: computed('options.[]', {
    get() {
      let options = this.get('options') || [];
      let searchAction = this.get('search');
      if (options.then) {
        this.set('loading', true);
        options.then(results => {
          if (this.get('isDestroyed')) { return; }
          this.set('results', results);
        });
        return this.previousResults || [];
      }
      let newResults = searchAction ? options : this.filter(options, this.get('searchText'));
      this.setProperties({ loading: false, currentlyHighlighted: undefined });
      this.previousResults = newResults;
      return newResults;
    },
    set(_, newResults) {
      this.previousResults = newResults;
      this.setProperties({ loading: false, currentlyHighlighted: undefined });
      return newResults;
    }
  }),

  resolvedSelected: computed('selected', {
    get() {
      let selected = this.get('selected');
      if (selected && selected.then) {
        selected.then(value => {
          if (this.get('isDestroyed')) { return; }
          // Ensure that we don't overwrite new value
          if (this.get('selected') === selected) {
            this.set('resolvedSelected', value);
          }
        });
      } else {
        return selected;
      }
    },
    set(_, v) { return v; }
  }),

  optionMatcher: computed('searchField', 'matcher', function() {
    let { matcher, searchField } = this.getProperties('matcher', 'searchField');
    if (searchField) {
      return (option, text) => matcher(get(option, searchField), text);
    } else {
      return (option, text) => matcher(option, text);
    }
  }),

  highlighted: computed('results.[]', 'currentlyHighlighted', 'resolvedSelected', function() {
    return this.get('currentlyHighlighted') || this.defaultHighlighted();
  }),

  resultsLength: computed('results.[]', function() {
    return countOptions(this.get('results'));
  }),

  eventSender: computed(function() {
    return EventSender.create();
  }),

  publicAPI: computed('registeredDropdown.isOpen', 'highlighted', 'searchText', function() {
    let dropdown = this.get('registeredDropdown');
    if (dropdown) {
      let ownActions = {
        search: (term, e) => this.send('search', dropdown, term, e),
        highlight: (option) => this.send('highlight', dropdown, option),
        select: (selected, e) => this.send('select', dropdown, selected, e),
        choose: (selected, e) => this._doChoose(dropdown, selected, e),
        handleKeydown: (e) => this.send('handleKeydown', dropdown, e)
      };
      return {
        isOpen: dropdown.isOpen,
        highlighted: this.get('highlighted'),
        searchText: this.get('searchText'),
        actions: assign(ownActions, dropdown.actions)
      };
    }
    return {};
  }),

  // Actions
  actions: {
    highlight(dropdown, option) {
      this._doHighlight(dropdown, option);
    },

    search(dropdown, term /*, e */) {
      this._doSearch(dropdown, term);
    },

    handleInput(e) {
      let term = e.target.value;
      let action = this.get('oninput');
      if (action) {
        let returnValue = action(e.target.value, this.get('publicAPI'), e);
        if (returnValue === false) { return; }
      }
      this.send('search', this.get('registeredDropdown'), term, e);
    },

    select(dropdown, selected, e) {
      return this._doSelect(dropdown, selected, e);
    },

    choose(dropdown, selection, e) {
      return this._doChoose(dropdown, selection, e);
    },

    handleKeydown(dropdown, e) {
      const onkeydown = this.get('onkeydown');
      if (onkeydown && onkeydown(this.get('publicAPI'), e) === false) { return; }
      if (e.keyCode === 38 || e.keyCode === 40) { // Up & Down
        return this._handleKeyUpDown(dropdown, e);
      } else if (e.keyCode === 13) {  // ENTER
        return this._handleKeyEnter(dropdown, e);
      } else if (e.keyCode === 9) {   //Tab
        return this._handleKeyTab(dropdown, e);
      } else if (e.keyCode === 27) {  // ESC
        return this._handleKeyESC(dropdown, e);
      } else if (e.keyCode >= 48 && e.keyCode <= 90 || e.keyCode === 32) { // Keys 0-9, a-z or SPACE
        return this._handleTriggerTyping(dropdown, e);
      }
    },

    handleFocus(dropdown, event) {
      const action = this.get('onfocus');
      if (action) {
        action(this.get('publicAPI'), event);
      }
      this.get('eventSender').trigger('focus');
    },

    // It is not evident what is going on here, so I'll explain why.
    //
    // As of this writting, Ember doesn allow to yield data to the "inverse" block.
    // Because of that, elements of this component rendered in the trigger can't receive the
    // yielded object contaning the public API of the ember-basic-dropdown, with actions for open,
    // close and toggle.
    //
    // The only possible workaround for this is to on initialization inject a similar object
    // to the one yielded and store it to make it available in the entire component.
    //
    // This this limitation on ember should be fixed soon, this is temporary. Because of that this
    // object will be passed to the action from the inverse block like if it was yielded.
    //
    registerDropdown(dropdown) {
      this.set('registeredDropdown', dropdown);
    },

    handleOpen(dropdown, e) {
      const action = this.get('onopen');
      if (action) {
        let returnValue = action(this.get('publicAPI'), e);
        if (returnValue === false || (e && e.defaultPrevented)) {
          return false;
        }
      }
      if (e) { this.set('openingEvent', e); }
      run.scheduleOnce('afterRender', this, this.scrollIfHighlightedIsOutOfViewport);
    },

    handleClose(dropdown, e) {
      const action = this.get('onclose');
      if (action) {
        let returnValue = action(this.get('publicAPI'), e);
        if (returnValue === false || (e && e.defaultPrevented)) {
          return false;
        }
      }
      if (e) { this.set('openingEvent', null); }
      this.send('highlight', dropdown, null, e);
    }
  },

  _handleKeyUpDown(dropdown, e) {
    if (dropdown.isOpen) {
      e.preventDefault();
      const newHighlighted = this.advanceSelectableOption(this.get('highlighted'), e.keyCode === 40 ? 1 : -1);
      this.send('highlight', dropdown, newHighlighted, e);
    } else {
      dropdown.actions.open(e);
    }
  },

  _handleKeyEnter(dropdown, e) {
    if (dropdown.isOpen) {
      return this._doChoose(dropdown, this.get('highlighted'), e);
    }
  },

  _handleKeyTab(dropdown, e) {
    dropdown.actions.close(e);
  },

  _handleKeyESC(dropdown, e) {
    dropdown.actions.close(e);
  },

  // Methods
  scrollIfHighlightedIsOutOfViewport() {
    if (!self.document) { return; }
    const optionsList = document.querySelector('.ember-power-select-options');
    if (!optionsList) { return; }
    const highlightedOption = optionsList.querySelector('.ember-power-select-option[aria-current="true"]');
    if (!highlightedOption) { return; }
    const optionTopScroll = highlightedOption.offsetTop - optionsList.offsetTop;
    const optionBottomScroll = optionTopScroll + highlightedOption.offsetHeight;
    if (optionBottomScroll > optionsList.offsetHeight + optionsList.scrollTop) {
      optionsList.scrollTop = optionBottomScroll - optionsList.offsetHeight;
    } else if (optionTopScroll < optionsList.scrollTop) {
      optionsList.scrollTop = optionTopScroll;
    }
  },

  indexOfOption(option) {
    return indexOfOption(this.get('results'), option);
  },

  optionAtIndex(index) {
    return optionAtIndex(this.get('results'), index);
  },

  advanceSelectableOption(activeHighlighted, step) {
    let resultsLength = this.get('resultsLength');
    let startIndex = Math.min(Math.max(this.indexOfOption(activeHighlighted) + step, 0), resultsLength - 1);
    let nextOption = this.optionAtIndex(startIndex);
    while (nextOption && get(nextOption, 'disabled')) {
      nextOption = this.optionAtIndex(startIndex += step);
    }
    return nextOption;
  },

  filter(options, term, skipDisabled = false) {
    return filterOptions(options || [], term, this.get('optionMatcher'), skipDisabled);
  },

  defaultHighlighted() {
    const selected = this.get('resolvedSelected');
    if (!selected || this.indexOfOption(selected) === -1) {
      let nextOption = this.optionAtIndex(0);
      while (nextOption && nextOption.disabled) {
        nextOption = this.advanceSelectableOption(nextOption, 1);
      }
      return nextOption;
    }
    return selected;
  },

  buildSelection(option) {
    return option;
  },

  _doChoose(dropdown, selected, e) {
    if (e && e.clientY) {
      let openingEvent = this.get('openingEvent');
      if (openingEvent && openingEvent.clientY) {
        if (Math.abs(openingEvent.clientY - e.clientY) < 2) { return; }
      }
    }
    this.send('select', dropdown, this.get('buildSelection')(selected), e);
    if (this.get('closeOnSelect')) {
      dropdown.actions.close(e);
      return false;
    }
  },

  _doSelect(dropdown, selected /*, e */) {
    if (this.get('resolvedSelected') !== selected) {
      this.get('onchange')(selected, this.get('publicAPI'));
    }
  },

  _doHighlight(dropdown, option) {
    if (option && get(option, 'disabled')) { return; }
    run.scheduleOnce('afterRender', this, this.scrollIfHighlightedIsOutOfViewport);
    this.set('currentlyHighlighted', option);
  },

  _doSearch(dropdown, term) {
    if (isBlank(term)) {
      this._resetSearch();
    } else {
      let searchAction = this.get('search');
      if (searchAction) {
        this._performSearch(searchAction, term);
      } else {
        let options = this.get('options');
        if (options.then) {
          options.then((data) => {
            this.setProperties({ results: this.filter(data, term), searchText: term, lastSearchedText: term });
          });
        } else {
          this.setProperties({ results: this.filter(options, term), searchText: term, lastSearchedText: term });
        }
      }
    }
  },

  _resetSearch() {
    let options = this.get('options') || [];
    this.activeSearch = null;
    if (options.then) {
      options.then((data) => {
        this.setProperties({ results: data, searchText: '', lastSearchedText: '', loading: false });
      });
    } else {
      this.setProperties({ results: options, searchText: '', lastSearchedText: '', loading: false });
    }
  },

  _performSearch(searchAction, term) {
    this.set('searchText', term);
    let search = searchAction(term, this.get('publicAPI'));
    if (!search) {
      this.setProperties({ lastSearchedText: term });
    } else if (search.then) {
      this.activeSearch = search;
      this.setProperties({ loading: true });
      search.then((results) => {
        if (this.activeSearch === search) { this.setProperties({ results, lastSearchedText: term }); }
      }, () => {
        if (this.activeSearch === search) { this.set('lastSearchedText', term); }
      });
    } else {
      this.setProperties({ results: search, lastSearchedText: term });
    }
  },

  _handleTriggerTyping(dropdown, e) {
    let term = this.get('expirableSearchText') + String.fromCharCode(e.keyCode);
    this.set('expirableSearchText', term);
    this.expirableSearchDebounceId = run.debounce(this, 'set', 'expirableSearchText', '', 1000);
    let firstMatch = this.filter(this.get('results'), term, true)[0]; // TODO: match only words starting with this substr?
    if (firstMatch !== undefined) {
      if (dropdown.isOpen) {
        this._doHighlight(dropdown, firstMatch, e);
      } else {
        this._doSelect(dropdown, firstMatch, e);
      }
    }
  }
});
