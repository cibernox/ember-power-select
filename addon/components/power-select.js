import Component from '@ember/component';
import { computed } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import { getOwner } from '@ember/application';
import { isEqual } from '@ember/utils';
import { get, set } from '@ember/object';
import { assert } from '@ember/debug';
import { DEBUG } from '@glimmer/env';
import { isBlank } from '@ember/utils';
import { isArray as isEmberArray } from '@ember/array';
import ArrayProxy from '@ember/array/proxy';
import layout from '../templates/components/power-select';
import fallbackIfUndefined from '../utils/computed-fallback-if-undefined';
import optionsMatcher from '../utils/computed-options-matcher';
import {
  defaultMatcher,
  indexOfOption,
  filterOptions,
  findOptionWithOffset,
  countOptions,
  defaultHighlighted,
  advanceSelectableOption,
  defaultTypeAheadMatcher
} from '../utils/group-utils';
import { task, timeout } from 'ember-concurrency';

// Copied from Ember. It shouldn't be necessary in Ember 2.5+
const assign = Object.assign || function EmberAssign(original, ...args) {
  for (let i = 0; i < args.length; i++) {
    let arg = args[i];
    if (!arg) {
      continue;
    }

    let updates = Object.keys(arg);

    for (let i = 0; i < updates.length; i++) {
      let prop = updates[i];
      original[prop] = arg[prop];
    }
  }

  return original;
};

function concatWithProperty(strings, property) {
  if (property) {
    strings.push(property);
  }
  return strings.join(' ');
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
  _repeatingChar: ''
};

export default Component.extend({
  // HTML
  layout,
  tagName: '',

  // Options
  searchEnabled: fallbackIfUndefined(true),
  matchTriggerWidth: fallbackIfUndefined(true),
  preventScroll: fallbackIfUndefined(false),
  matcher: fallbackIfUndefined(defaultMatcher),
  loadingMessage: fallbackIfUndefined('Loading options...'),
  noMatchesMessage: fallbackIfUndefined('No results found'),
  searchMessage: fallbackIfUndefined('Type to search'),
  closeOnSelect: fallbackIfUndefined(true),
  defaultHighlighted: fallbackIfUndefined(defaultHighlighted),
  typeAheadMatcher: fallbackIfUndefined(defaultTypeAheadMatcher),
  triggerRole: fallbackIfUndefined('combobox'),

  afterOptionsComponent: fallbackIfUndefined(null),
  beforeOptionsComponent: fallbackIfUndefined('power-select/before-options'),
  optionsComponent: fallbackIfUndefined('power-select/options'),
  groupComponent: fallbackIfUndefined('power-select/power-select-group'),
  selectedItemComponent: fallbackIfUndefined(null),
  triggerComponent: fallbackIfUndefined('power-select/trigger'),
  searchMessageComponent: fallbackIfUndefined('power-select/search-message'),
  placeholderComponent: fallbackIfUndefined('power-select/placeholder'),
  buildSelection: fallbackIfUndefined(function buildSelection(option) {
    return option;
  }),

  _triggerTagName: fallbackIfUndefined('div'),
  _contentTagName: fallbackIfUndefined('div'),

  // Private state
  publicAPI: initialState,

  // Lifecycle hooks
  init() {
    this._super(...arguments);
    this._publicAPIActions = {
      search: (...args) => {
        if (this.get('isDestroying')) {
          return;
        }
        return this.send('search', ...args)
      },
      highlight: (...args) => this.send('highlight', ...args),
      select: (...args) => this.send('select', ...args),
      choose: (...args) => this.send('choose', ...args),
      scrollTo: (...args) => scheduleOnce('afterRender', this, this.send, 'scrollTo', ...args)
    };
    assert('{{power-select}} requires an `onchange` function', this.get('onchange') && typeof this.get('onchange') === 'function');
  },

  willDestroy() {
    this._super(...arguments);
    this._removeObserversInOptions();
    this._removeObserversInSelected();
    let action = this.get('registerAPI');
    if (action) {
      action(null);
    }
  },

  // CPs
  inTesting: computed(function() {
    let config = getOwner(this).resolveRegistration('config:environment');
    return config.environment === 'test';
  }),

  selected: computed({
    get() {
      return null;
    },
    set(_, selected) {
      if (selected && get(selected, 'then')) {
        this.get('_updateSelectedTask').perform(selected);
      } else {
        scheduleOnce('actions', this, this.updateSelection, selected);
      }
      return selected;
    }
  }),

  options: computed({
    get() {
      return [];
    },
    set(_, options, oldOptions) {
      if (options === oldOptions) {
        return options;
      }
      if (options && get(options, 'then')) {
        this.get('_updateOptionsTask').perform(options);
      } else {
        scheduleOnce('actions', this, this.updateOptions, options);
      }
      return options;
    }
  }),

  optionMatcher: optionsMatcher('matcher', defaultMatcher),

  typeAheadOptionMatcher: optionsMatcher('typeAheadMatcher', defaultTypeAheadMatcher),

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

  mustShowSearchMessage: computed('publicAPI.{loading,searchText,resultsCount}', 'search', 'searchMessage', function() {
    let publicAPI = this.get('publicAPI');
    return !publicAPI.loading && publicAPI.searchText.length === 0
      && !!this.get('search') && !!this.get('searchMessage')
      && publicAPI.resultsCount === 0;
  }),

  mustShowNoMessages: computed('search', 'publicAPI.{lastSearchedText,resultsCount,loading}', function() {
    let publicAPI = this.get('publicAPI');
    return !publicAPI.loading
      && publicAPI.resultsCount === 0
      && (!this.get('search') || publicAPI.lastSearchedText.length > 0);
  }),

  ariaAutocomplete: computed('searchEnabled', function() {
    return this.get('searchEnabled') ? 'list' : 'none';
  }),

  highlightedId: computed('publicAPI.highlighted', function() {
    let { highlighted, results, uniqueId } = this.get('publicAPI');
    return `${uniqueId}-${indexOfOption(results, highlighted)}`;
  }),

  resultsCountId: computed('publicAPI.uniqueId', function() {
    return `ember-power-select-results-count-${this.get('publicAPI.uniqueId')}`;
  }),

  // Actions
  actions: {
    registerAPI(dropdown) {
      if (!dropdown) {
        return;
      }
      let publicAPI = assign({}, this.get('publicAPI'), dropdown);
      publicAPI.actions = assign({}, dropdown.actions, this._publicAPIActions);
      this.setProperties({
        publicAPI,
        optionsId: `ember-power-select-options-${publicAPI.uniqueId}`
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
      if (e) {
        this.openingEvent = null;
      }
      this.updateState({ highlighted: undefined });
    },

    onInput(e) {
      let term = e.target.value;
      let action = this.get('oninput');
      let publicAPI = this.get('publicAPI');
      let correctedTerm;
      if (action) {
        correctedTerm = action(term, publicAPI, e);
        if (correctedTerm === false) {
          return;
        }
      }
      publicAPI.actions.search(typeof correctedTerm === 'string' ? correctedTerm : term);
    },

    highlight(option /* , e */) {
      if (option && get(option, 'disabled')) {
        return;
      }
      this.updateState({ highlighted: option });
    },

    select(selected, e) {
      let publicAPI = this.get('publicAPI');
      if (!isEqual(publicAPI.selected, selected)) {
        this.get('onchange')(selected, publicAPI, e);
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
      if (!this.get('inTesting')) {
        if (e && e.clientY) {
          if (this.openingEvent && this.openingEvent.clientY) {
            if (Math.abs(this.openingEvent.clientY - e.clientY) < 2) {
              return;
            }
          }
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
      if (e.ctrlKey || e.metaKey) {
        return false;
      }
      if ((e.keyCode >= 48 && e.keyCode <= 90) // Keys 0-9, a-z
        || this._isNumpadKeyEvent(e)) {
        this.get('triggerTypingTask').perform(e);
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

    scrollTo(option, ...rest) {
      if (!document || !option) {
        return;
      }
      let publicAPI = this.get('publicAPI');
      let userDefinedScrollTo = this.get('scrollTo');
      if (userDefinedScrollTo) {
        return userDefinedScrollTo(option, publicAPI, ...rest);
      }
      let optionsList = document.getElementById(`ember-power-select-options-${publicAPI.uniqueId}`);
      if (!optionsList) {
        return;
      }
      let index = indexOfOption(publicAPI.results, option);
      if (index === -1) {
        return;
      }
      let optionElement = optionsList.querySelectorAll('[data-option-index]').item(index);
      if (!optionElement) {
        return;
      }
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

    onTriggerBlur(_, event) {
      this.send('deactivate');
      let action = this.get('onblur');
      if (action) {
        action(this.get('publicAPI'), event);
      }
    },

    onBlur(event) {
      this.send('deactivate');
      let action = this.get('onblur');
      if (action) {
        action(this.get('publicAPI'), event);
      }
    },

    activate() {
      scheduleOnce('actions', this, 'setIsActive', true);
    },

    deactivate() {
      scheduleOnce('actions', this, 'setIsActive', false);
    }
  },

  // Tasks
  triggerTypingTask: task(function* (e) {
    // In general, a user doing this interaction means to have a different result.
    let searchStartOffset = 1;
    let publicAPI = this.get('publicAPI');
    let repeatingChar = publicAPI._repeatingChar;
    let charCode = e.keyCode;
    if (this._isNumpadKeyEvent(e)) {
      charCode -= 48; // Adjust char code offset for Numpad key codes. Check here for numapd key code behavior: https://goo.gl/Qwc9u4
    }
    let term;

    // Check if user intends to cycle through results. _repeatingChar can only be the first character.
    let c = String.fromCharCode(charCode);
    if (c === publicAPI._repeatingChar) {
      term = c;
    } else {
      term = publicAPI._expirableSearchText + c;
    }

    if (term.length > 1) {
      // If the term is longer than one char, the user is in the middle of a non-cycling interaction
      // so the offset is just zero (the current selection is a valid match).
      searchStartOffset = 0;
      repeatingChar = '';
    } else {
      repeatingChar = c;
    }

    // When the select is open, the "selection" is just highlighted.
    if (publicAPI.isOpen && publicAPI.highlighted) {
      searchStartOffset += indexOfOption(publicAPI.options, publicAPI.highlighted);
    } else if (!publicAPI.isOpen && publicAPI.selected) {
      searchStartOffset += indexOfOption(publicAPI.options, publicAPI.selected);
    } else {
      searchStartOffset = 0;
    }

    // The char is always appended. That way, searching for words like "Aaron" will work even
    // if "Aa" would cycle through the results.
    this.updateState({ _expirableSearchText: publicAPI._expirableSearchText + c, _repeatingChar: repeatingChar });
    let match = this.findWithOffset(publicAPI.options, term, searchStartOffset, true);
    if (match !== undefined) {
      if (publicAPI.isOpen) {
        publicAPI.actions.highlight(match, e);
        publicAPI.actions.scrollTo(match, e);
      } else {
        publicAPI.actions.select(match, e);
      }
    }
    yield timeout(1000);
    this.updateState({ _expirableSearchText: '', _repeatingChar: '' });
  }).restartable(),

  _updateSelectedTask: task(function* (selectionPromise) {
    let selection = yield selectionPromise;
    this.updateSelection(selection);
  }).restartable(),

  _updateOptionsTask: task(function* (optionsPromise) {
    if (optionsPromise instanceof ArrayProxy) {
      this.updateOptions(optionsPromise.get('content'));
    }
    this.updateState({ loading: true });
    try {
      let options = yield optionsPromise;
      this.updateOptions(options);
    } finally {
      this.updateState({ loading: false });
    }
  }).restartable(),

  handleAsyncSearchTask: task(function* (term, searchThenable) {
    try {
      this.updateState({ loading: true });
      let results = yield searchThenable;
      let resultsArray = toPlainArray(results);
      this.updateState({
        results: resultsArray,
        _rawSearchResults: results,
        lastSearchedText: term,
        resultsCount: countOptions(results),
        loading: false
      });
      this.resetHighlighted();
    } catch(e) {
      this.updateState({ lastSearchedText: term, loading: false });
    } finally {
      if (typeof searchThenable.cancel === 'function') {
        searchThenable.cancel();
      }
    }
  }).restartable(),

  // Methods
  setIsActive(isActive) {
    this.updateState({ isActive });
  },

  filter(options, term, skipDisabled = false) {
    return filterOptions(options || [], term, this.get('optionMatcher'), skipDisabled);
  },

  findWithOffset(options, term, offset, skipDisabled = false) {
    return findOptionWithOffset(options || [], term, this.get('typeAheadOptionMatcher'), offset, skipDisabled);
  },

  updateOptions(options) {
    this._removeObserversInOptions();
    if (!options) {
      return;
    }
    if (DEBUG) {
      (function walk(collection) {
        for (let i = 0; i < get(collection, 'length'); i++) {
          let entry = collection.objectAt ? collection.objectAt(i) : collection[i];
          let subOptions = get(entry, 'options');
          let isGroup = !!get(entry, 'groupName') && !!subOptions;
          if (isGroup) {
            assert('ember-power-select doesn\'t support promises inside groups. Please, resolve those promises and turn them into arrays before passing them to ember-power-select', !get(subOptions, 'then'));
            walk(subOptions);
          }
        }
      })(options);
    }
    if (options && options.addObserver) {
      options.addObserver('[]', this, this._updateOptionsAndResults);
      this._observedOptions = options;
    }
    this._updateOptionsAndResults(options);
  },

  updateSelection(selection) {
    this._removeObserversInSelected();
    if (isEmberArray(selection)) {
      if (selection && selection.addObserver) {
        selection.addObserver('[]', this, this._updateSelectedArray);
        this._observedSelected = selection;
      }
      this._updateSelectedArray(selection);
    } else if (selection !== this.get('publicAPI').selected) {
      this.updateState({ selected: selection, highlighted: selection });
    }
  },

  resetHighlighted() {
    let publicAPI = this.get('publicAPI');
    let defaultHightlighted = this.get('defaultHighlighted');
    let highlighted;
    if (typeof defaultHightlighted === 'function') {
      highlighted = defaultHightlighted(publicAPI);
    } else {
      highlighted = defaultHightlighted;
    }
    this.updateState({ highlighted });
  },

  _updateOptionsAndResults(opts) {
    if (get(this, 'isDestroying')) {
      return;
    }
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
    if (get(this, 'isDestroyed')) {
      return;
    }
    this.updateState({ selected: toPlainArray(selection) });
  },

  _resetSearch() {
    let results = this.get('publicAPI').options;
    this.get('handleAsyncSearchTask').cancelAll();
    this.updateState({
      results,
      searchText: '',
      lastSearchedText: '',
      resultsCount: countOptions(results),
      loading: false
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
    } else if (get(search, 'then')) {
      this.get('handleAsyncSearchTask').perform(term, search);
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
      e.preventDefault(); // Prevents scrolling of the page.
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

  _removeObserversInOptions() {
    if (this._observedOptions) {
      this._observedOptions.removeObserver('[]', this, this._updateOptionsAndResults);
    }
  },

  _removeObserversInSelected() {
    if (this._observedSelected) {
      this._observedSelected.removeObserver('[]', this, this._updateSelectedArray);
    }
  },

  _isNumpadKeyEvent(e) {
    return e.keyCode >= 96 && e.keyCode <= 105;
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
