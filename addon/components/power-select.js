import Component from 'ember-component';
import layout from '../templates/components/power-select';
import fallbackIfUndefined from '../utils/computed-fallback-if-undefined';
import { assign } from 'ember-platform';
import { isBlank } from 'ember-utils';
import { isEmberArray } from 'ember-array/utils';
import computed from 'ember-computed';
import get from 'ember-metal/get';
import set, { setProperties } from 'ember-metal/set';
import { scheduleOnce, debounce, cancel } from 'ember-runloop';
import RSVP from 'rsvp';
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
  let { disabled, option } = optionAtIndex(options, startIndex)
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
  tagName: fallbackIfUndefined(''),

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
  loading: false,
  activeSearch: null,
  publicAPI: {
    options: [],              // Contains the resolved collection of options
    results: [],              // Contains the active set of results
    resultsCount: 0,          // Contains the number of results incuding those nested/disabled
    selected: undefined,      // Contains the resolved selected option
    highlighted: undefined,   // Contains the currently highlighted option (if any)
    searchText: '',           // Contains the text of the current search
    lastSearchedText: ''      // Contains the text of the last finished search
  },

  // Lifecycle hooks
  init() {
    this._super(...arguments);
    this.triggerId = `ember-power-select-trigger-${this.elementId}`;
    this.optionsId = `ember-power-select-options-${this.elementId}`;
    Ember.assert('{{power-select}} requires an `onchange` function', this.get('onchange') && typeof this.get('onchange') === 'function');
  },

  willDestroy() {
    this._super(...arguments);
    this.activeSearch = null;
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
        set(this, 'loading', true);
        options.then(resolvedOptions => {
          this.updateOptions(resolvedOptions);
        }, () => set(this, 'loading', false));
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

  concatenatedTriggerClasses: computed('triggerClass', /* 'hasFocusInside', */ function() {
    let classes = ['ember-power-select-trigger'];
    // if (this.get('hasFocusInside')) {
    //   classes.push('ember-power-select-trigger--focus-inside');
    // }
    return concatWithProperty(classes, this.get('triggerClass'));
  }),

  concatenatedDropdownClasses: computed('dropdownClass', /* 'hasFocusInside', */ function() {
    let classes = ['ember-power-select-dropdown', `ember-power-select-dropdown-${this.elementId}`];
    // if (this.get('hasFocusInside')) {
    //   classes.push('ember-power-select-dropdown--focus-inside');
    // }
    return concatWithProperty(classes, this.get('dropdownClass'));
  }),

  mustShowSearchMessage: computed('publicAPI.{searchText,resultsCount}', 'search', 'searchMessage', function(){
    return this.publicAPI.searchText.length === 0 &&
      !!this.get('search') && !!this.get('searchMessage') &&
      this.publicAPI.resultsCount === 0;
  }),

  mustShowNoMessages: computed('loading', 'search', 'publicAPI.{lastSearchedText,resultsCount}', function() {
    return !this.get('loading') &&
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
        // handleKeydown: () => console.log('handleKeydown!!'),
        scrollTo: (...args) => scheduleOnce('afterRender', this, this.send, 'scrollTo', ...args)
      };
      assign(dropdown.actions, actions);
      assign(dropdown, this.publicAPI);
      this.publicAPI = dropdown;
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

    highlight(option, e) {
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
      this.publicAPI.actions.select(this.get('buildSelection')(selected), e);
      if (this.get('closeOnSelect')) {
        this.publicAPI.actions.close(e);
        return false;
      }
    },

    onTriggerKeydown(_, e) {
      let onkeydown = this.get('onkeydown');
      if (onkeydown && onkeydown(this.publicAPI, e) === false) {
        return false;
      }
      if (e.keyCode >= 48 && e.keyCode <= 90) { // Keys 0-9, a-z or SPACE
        return this._handleTriggerTyping(e);
      } else {
        return this._routeKeydown(e);
      }
    },

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
      let action = this.get('onfocus');
      if (action) {
        action(this.publicAPI, event);
      }
      // this.get('eventSender').trigger('focus');
    },
  },

  // Methods
  filter(options, term, skipDisabled = false) {
    return filterOptions(options || [], term, this.get('optionMatcher'), skipDisabled);
  },

  updateOptions(options) {
    if (!options) {
      return;
    }
    this._updateOptionsAndResults(options);
    if (options && options.addObserver) {
      options.addObserver('[]', this, this._updateOptionsAndResults);
    }
  },

  updateSelection(selection) {
    if (isEmberArray(selection)) {
      set(this.publicAPI, 'selected', toPlainArray(selection));
    } else {
      setProperties(this.publicAPI, { selected: selection, highlighted: selection });
    }
  },

  resetHighlighted() {
    let highlighted = defaultHighlighted(this.publicAPI.results, this.publicAPI.highlighted || this.publicAPI.selected);
    set(this.publicAPI, 'highlighted', highlighted);
  },

  buildSelection(option) {
    return option;
  },

  _updateOptionsAndResults(opts) {
    set(this, 'loading', false);
    let options = toPlainArray(opts);
    if (this.getAttr('search')) { // external search
      setProperties(this.publicAPI, { options, results: options, resultsCount: countOptions(options) });
    } else { // filter
      let results = isBlank(this.publicAPI.searchText) ? options : this.filter(options, this.publicAPI.searchText);
      setProperties(this.publicAPI, { results, options, resultsCount: countOptions(results) });
      if (this.publicAPI.isOpen) {
        this.resetHighlighted();
      }
    }
  },

  _resetSearch() {
    let results = this.publicAPI.options;
    this.activeSearch = null;
    set(this, 'loading', false);
    setProperties(this.publicAPI, { results, searchText: '', lastSearchedText: '', resultsCount: countOptions(results) });
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
      set(this, 'loading', true);
      this.activeSearch = search;
      search.then((results) => {
        if (this.activeSearch === search) {
          let resultsArray = toPlainArray(results);
          setProperties(this.publicAPI, {
            results: resultsArray,
            lastSearchedText: term,
            resultsCount: countOptions(results)
          });
          this.resetHighlighted();
          set(this, 'loading', false);
        }
      }, () => {
        if (this.activeSearch === search) {
          set(this.publicAPI, 'lastSearchedText', term);
          set(this, 'loading', false);
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
    } else if (e.keyCode === 32) {  // Space
      return this._handleKeySpace(e);
    } else if (e.keyCode === 9) {   // Tab
      return this._handleKeyTab(e);
    } else if (e.keyCode === 27) {  // ESC
      return this._handleKeyESC(e);
    }
  },

  _handleKeyUpDown(e) {
    if (this.publicAPI.isOpen) {
      e.preventDefault();
      let step = e.keyCode === 40 ? 1 : -1;
      let newHighlighted = advanceSelectableOption(this.publicAPI.results, this.publicAPI.highlighted, step);
      this.publicAPI.actions.highlight(newHighlighted, e);
      this.publicAPI.actions.scrollTo(newHighlighted);
    } else {
      this.publicAPI.actions.open(e);
    }
  },

  _handleKeyEnter(e) {
    if (this.publicAPI.isOpen) {
      this.publicAPI.actions.choose(this.publicAPI.highlighted, e);
      return false;
    }
  },

  _handleKeySpace(e) {
    if (this.publicAPI.isOpen) {
      e.preventDefault();
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



// import Ember from 'ember';
// import layout from '../templates/components/power-select';
// import { defaultMatcher, indexOfOption, optionAtIndex, filterOptions, countOptions } from '../utils/group-utils';
// import fallbackIfUndefined from '../utils/computed-fallback-if-undefined';

// const { computed, run, get, isBlank } = Ember;
// const EventSender = Ember.Object.extend(Ember.Evented);
// const assign = Ember.assign || Ember.merge;
// function concatWithProperty(strings, property) {
//   if (property) { strings.push(property); }
//   return strings.join(' ');
// }

// export default Ember.Component.extend({
//   // HTML
//   layout,
//   tagName: fallbackIfUndefined(''),

//   // Config
//   disabled: fallbackIfUndefined(false),
//   placeholder: fallbackIfUndefined(null),
//   loadingMessage: fallbackIfUndefined('Loading options...'),
//   noMatchesMessage: fallbackIfUndefined('No results found'),
//   verticalPosition: fallbackIfUndefined('auto'),
//   horizontalPosition: fallbackIfUndefined('auto'),
//   matcher: fallbackIfUndefined(defaultMatcher),
//   searchField: fallbackIfUndefined(null),
//   search: fallbackIfUndefined(null),
//   closeOnSelect: fallbackIfUndefined(true),
//   dropdownClass: fallbackIfUndefined(null),
//   triggerClass: fallbackIfUndefined(null),
//   dir: fallbackIfUndefined(null),
//   initiallyOpened: fallbackIfUndefined(false),
//   searchEnabled: fallbackIfUndefined(true),
//   searchMessage: fallbackIfUndefined("Type to search"),
//   searchPlaceholder: fallbackIfUndefined(null),
//   allowClear: fallbackIfUndefined(false),
//   triggerComponent: fallbackIfUndefined('power-select/trigger'),
//   selectedItemComponent: fallbackIfUndefined(null),
//   optionsComponent: fallbackIfUndefined('power-select/options'),
//   beforeOptionsComponent: fallbackIfUndefined('power-select/before-options'),
//   afterOptionsComponent: fallbackIfUndefined(null),
//   matchTriggerWidth: fallbackIfUndefined(true),

//   // Attrs
//   searchText: '',
//   lastSearchedText: '',
//   expirableSearchText: '',
//   activeSearch: null,
//   openingEvent: null,
//   loading: false,
//   previousResults: null,

//   // Lifecycle hooks
//   init() {
//     this._super(...arguments);
//     Ember.assert('{{power-select}} requires an `onchange` function', this.get('onchange') && typeof this.get('onchange') === 'function');
//   },

//   willDestroy() {
//     this._super(...arguments);
//     this.activeSearch = null;
//     run.cancel(this.expirableSearchDebounceId);
//   },

//   // CPs
//   triggerId: computed(function() {
//     return `ember-power-select-trigger-${this.elementId}`;
//   }),

//   optionsId: computed(function() {
//     return `ember-power-select-options-${this.elementId}`;
//   }),

//   concatenatedTriggerClasses: computed('triggerClass', 'hasFocusInside', function() {
//     let classes = ['ember-power-select-trigger'];
//     if (this.get('hasFocusInside')) {
//       classes.push('ember-power-select-trigger--focus-inside');
//     }
//     return concatWithProperty(classes, this.get('triggerClass'));
//   }),

//   concatenatedDropdownClasses: computed('dropdownClass', 'hasFocusInside', function() {
//     let classes = ['ember-power-select-dropdown', `ember-power-select-dropdown-${this.elementId}`];
//     if (this.get('hasFocusInside')) {
//       classes.push('ember-power-select-dropdown--focus-inside');
//     }
//     return concatWithProperty(classes, this.get('dropdownClass'));
//   }),

//   mustShowSearchMessage: computed('searchText', 'search', 'searchMessage', 'results.length', function(){
//     return this.get('searchText.length') === 0 && !!this.get('search') && !!this.get('searchMessage') && this.get('results.length') === 0;
//   }),

//   mustShowNoMessages: computed('results.length', 'loading', 'search', 'lastSearchedText', function() {
//     return !this.get('loading') && this.get('results.length') === 0 && (!this.get('search') || this.get('lastSearchedText.length') > 0);
//   }),

//   results: computed('options.[]', {
//     get() {
//       let options = this.get('options') || [];
//       let searchAction = this.get('search');
//       if (options.then) {
//         this.set('loading', true);
//         options.then(results => {
//           if (this.get('isDestroyed')) { return; }
//           this.set('results', results);
//         });
//         return this.previousResults || [];
//       }
//       let newResults = searchAction ? options : this.filter(options, this.get('searchText'));
//       this.setProperties({ loading: false, currentlyHighlighted: undefined });
//       this.previousResults = newResults;
//       return newResults;
//     },
//     set(_, newResults) {
//       this.previousResults = newResults;
//       this.setProperties({ loading: false, currentlyHighlighted: undefined });
//       return newResults;
//     }
//   }),

//   resolvedSelected: computed('selected', {
//     get() {
//       let selected = this.get('selected');
//       if (selected && selected.then) {
//         selected.then(value => {
//           if (this.get('isDestroyed')) { return; }
//           // Ensure that we don't overwrite new value
//           if (this.get('selected') === selected) {
//             this.set('resolvedSelected', value);
//           }
//         });
//       } else {
//         return selected;
//       }
//     },
//     set(_, v) { return v; }
//   }),

//   optionMatcher: computed('searchField', 'matcher', function() {
//     let { matcher, searchField } = this.getProperties('matcher', 'searchField');
//     if (searchField && matcher === defaultMatcher) {
//       return (option, text) => matcher(get(option, searchField), text);
//     } else {
//       return (option, text) => matcher(option, text);
//     }
//   }),

//   highlighted: computed('results.[]', 'currentlyHighlighted', 'resolvedSelected', function() {
//     return this.get('currentlyHighlighted') || this.defaultHighlighted();
//   }),

//   resultsLength: computed('results.[]', function() {
//     return countOptions(this.get('results'));
//   }),

//   eventSender: computed(function() {
//     return EventSender.create();
//   }),

//   publicAPI: computed('dropdown.isOpen', 'highlighted', 'searchText', function() {
//     let dropdown = this.get('dropdown');
//     if (dropdown) {
//       let ownActions = {
//         search: (term, e) => this.send('search', dropdown, term, e),
//         highlight: (option) => this.send('highlight', dropdown, option),
//         select: (selected, e) => this.send('select', dropdown, selected, e),
//         choose: (selected, e) => this._doChoose(dropdown, selected, e),
//         handleKeydown: (e) => this.send('handleKeydown', dropdown, e),
//         scrollTo: (option, e) => this.send('scrollTo', option, dropdown, e)
//       };
//       return {
//         isOpen: dropdown.isOpen,
//         highlighted: this.get('highlighted'),
//         searchText: this.get('searchText'),
//         actions: assign(ownActions, dropdown.actions)
//       };
//     }
//     return {};
//   }),

//   // Actions
//   actions: {
//     highlight(dropdown, option) {
//       this._doHighlight(dropdown, option);
//     },

//     search(dropdown, term /*, e */) {
//       this._doSearch(dropdown, term);
//     },

//     handleInput(e) {
//       let term = e.target.value;
//       let action = this.get('oninput');
//       if (action) {
//         let returnValue = action(e.target.value, this.get('publicAPI'), e);
//         if (returnValue === false) { return; }
//       }
//       this.send('search', this.get('dropdown'), term, e);
//     },

//     select(dropdown, selected, e) {
//       return this._doSelect(dropdown, selected, e);
//     },

//     choose(dropdown, selection, e) {
//       return this._doChoose(dropdown, selection, e);
//     },

//     handleKeydown(dropdown, e) {
//       const onkeydown = this.get('onkeydown');
//       if (onkeydown && onkeydown(this.get('publicAPI'), e) === false) { return false; }
//       if (e.keyCode === 38 || e.keyCode === 40) { // Up & Down
//         return this._handleKeyUpDown(dropdown, e);
//       } else if (e.keyCode === 13) {  // ENTER
//         return this._handleKeyEnter(dropdown, e);
//       } else if (e.keyCode === 32) {  // Space
//         return this._handleKeySpace(dropdown, e);
//       } else if (e.keyCode === 9) {   // Tab
//         return this._handleKeyTab(dropdown, e);
//       } else if (e.keyCode === 27) {  // ESC
//         return this._handleKeyESC(dropdown, e);
//       } else if (e.keyCode >= 48 && e.keyCode <= 90 || e.keyCode === 32) { // Keys 0-9, a-z or SPACE
//         return this._handleTriggerTyping(dropdown, e);
//       }
//     },

//     handleFocus(dropdown, event) {
//       const action = this.get('onfocus');
//       if (action) {
//         action(this.get('publicAPI'), event);
//       }
//       this.get('eventSender').trigger('focus');
//     },

//     scrollTo(option /*, dropdown, e */) {
//       if (!self.document || !option) { return; }
//       let optionsList = self.document.querySelector('.ember-power-select-options');
//       if (!optionsList) { return; }
//       let index = this.indexOfOption(option);
//       if (index === -1) { return; }
//       let optionElement = optionsList.querySelectorAll('[data-option-index]').item(index);
//       let optionTopScroll = optionElement.offsetTop - optionsList.offsetTop;
//       let optionBottomScroll = optionTopScroll + optionElement.offsetHeight;
//       if (optionBottomScroll > optionsList.offsetHeight + optionsList.scrollTop) {
//         optionsList.scrollTop = optionBottomScroll - optionsList.offsetHeight;
//       } else if (optionTopScroll < optionsList.scrollTop) {
//         optionsList.scrollTop = optionTopScroll;
//       }
//     },

//     handleOpen(dropdown, e) {
//       let action = this.get('onopen');
//       if (action && action(this.get('publicAPI'), e) === false) {
//         return false;
//       }
//       if (e) { this.set('openingEvent', e); }
//     },

//     handleClose(dropdown, e) {
//       let action = this.get('onclose');
//       if (action && action(this.get('publicAPI'), e) === false) {
//         return false;
//       }
//       if (e) { this.set('openingEvent', null); }
//       this.send('highlight', dropdown, null, e);
//     }
//   },

//   _handleKeyUpDown(dropdown, e) {
//     if (dropdown.isOpen) {
//       e.preventDefault();
//       let newHighlighted = this.advanceSelectableOption(this.get('highlighted'), e.keyCode === 40 ? 1 : -1);
//       this.send('highlight', dropdown, newHighlighted, e);
//       run.scheduleOnce('afterRender', this, this.send, 'scrollTo', newHighlighted, dropdown, e);
//     } else {
//       dropdown.actions.open(e);
//     }
//   },

//   _handleKeyEnter(dropdown, e) {
//     if (dropdown.isOpen) {
//       return this._doChoose(dropdown, this.get('highlighted'), e);
//     }
//   },

//   _handleKeySpace(dropdown, e) {
//     if (dropdown.isOpen) {
//       e.preventDefault();
//       return this._doChoose(dropdown, this.get('highlighted'), e);
//     }
//   },

//   _handleKeyTab(dropdown, e) {
//     dropdown.actions.close(e);
//   },

//   _handleKeyESC(dropdown, e) {
//     dropdown.actions.close(e);
//   },

//   // Methods
//   indexOfOption(option) {
//     return indexOfOption(this.get('results'), option);
//   },

//   optionAtIndex(index) {
//     return optionAtIndex(this.get('results'), index);
//   },

//   advanceSelectableOption(activeHighlighted, step) {
//     let resultsLength = this.get('resultsLength');
//     let startIndex = Math.min(Math.max(this.indexOfOption(activeHighlighted) + step, 0), resultsLength - 1);
//     let { disabled, option } = this.optionAtIndex(startIndex);
//     while (option && disabled) {
//       let next = this.optionAtIndex(startIndex += step);
//       disabled = next.disabled;
//       option = next.option;
//     }
//     return option;
//   },

//   filter(options, term, skipDisabled = false) {
//     return filterOptions(options || [], term, this.get('optionMatcher'), skipDisabled);
//   },

//   defaultHighlighted() {
//     const selected = this.get('resolvedSelected');
//     if (selected === undefined || this.indexOfOption(selected) === -1) {
//       return this.advanceSelectableOption(selected, 1);
//     }
//     return selected;
//   },

//   buildSelection(option) {
//     return option;
//   },

//   _doChoose(dropdown, selected, e) {
//     if (e && e.clientY) {
//       let openingEvent = this.get('openingEvent');
//       if (openingEvent && openingEvent.clientY) {
//         if (Math.abs(openingEvent.clientY - e.clientY) < 2) { return; }
//       }
//     }
//     this.send('select', dropdown, this.get('buildSelection')(selected), e);
//     if (this.get('closeOnSelect')) {
//       dropdown.actions.close(e);
//       return false;
//     }
//   },

//   _doSelect(dropdown, selected /*, e */) {
//     if (this.get('resolvedSelected') !== selected) {
//       this.get('onchange')(selected, this.get('publicAPI'));
//     }
//   },

//   _doHighlight(dropdown, option) {
//     if (option && get(option, 'disabled')) { return; }
//     this.set('currentlyHighlighted', option);
//   },

//   _doSearch(dropdown, term) {
//     if (isBlank(term)) {
//       this._resetSearch();
//     } else {
//       let searchAction = this.get('search');
//       if (searchAction) {
//         this._performSearch(searchAction, term);
//       } else {
//         let options = this.get('options');
//         if (options.then) {
//           options.then((data) => {
//             this.setProperties({ results: this.filter(data, term), searchText: term, lastSearchedText: term });
//           });
//         } else {
//           this.setProperties({ results: this.filter(options, term), searchText: term, lastSearchedText: term });
//         }
//       }
//     }
//   },

//   _resetSearch() {
//     let options = this.get('options') || [];
//     this.activeSearch = null;
//     if (options.then) {
//       options.then((data) => {
//         this.setProperties({ results: data, searchText: '', lastSearchedText: '', loading: false });
//       });
//     } else {
//       this.setProperties({ results: options, searchText: '', lastSearchedText: '', loading: false });
//     }
//   },

//   _performSearch(searchAction, term) {
//     this.set('searchText', term);
//     let search = searchAction(term, this.get('publicAPI'));
//     if (!search) {
//       this.setProperties({ lastSearchedText: term });
//     } else if (search.then) {
//       this.activeSearch = search;
//       this.setProperties({ loading: true });
//       search.then((results) => {
//         if (this.activeSearch === search) { this.setProperties({ results, lastSearchedText: term }); }
//       }, () => {
//         if (this.activeSearch === search) { this.set('lastSearchedText', term); }
//       });
//     } else {
//       this.setProperties({ results: search, lastSearchedText: term });
//     }
//   },

//   _handleTriggerTyping(dropdown, e) {
//     let term = this.get('expirableSearchText') + String.fromCharCode(e.keyCode);
//     this.set('expirableSearchText', term);
//     this.expirableSearchDebounceId = run.debounce(this, 'set', 'expirableSearchText', '', 1000);
//     let matches = this.filter(this.get('results'), term, true);
//     if (get(matches, 'length') === 0) { return; }
//     let firstMatch = optionAtIndex(matches, 0);
//     if (firstMatch !== undefined) {
//       if (dropdown.isOpen) {
//         this._doHighlight(dropdown, firstMatch.option, e);
//         this.send('scrollTo', firstMatch.option, dropdown, e);
//       } else {
//         this._doSelect(dropdown, firstMatch.option, e);
//       }
//     }
//   }
// });
