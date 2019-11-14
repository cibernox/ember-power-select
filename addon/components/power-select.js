
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action, get } from '@ember/object';
import { addObserver, removeObserver } from '@ember/object/observers';
import { scheduleOnce } from '@ember/runloop';
import { isEqual } from '@ember/utils';
import { assert } from '@ember/debug';
import {
  indexOfOption,
  filterOptions,
  findOptionWithOffset,
  countOptions,
  defaultHighlighted,
  advanceSelectableOption,
  defaultMatcher,
  defaultTypeAheadMatcher
} from '../utils/group-utils';
import { task, timeout } from 'ember-concurrency';

export default class PowerSelect extends Component {
  // Untracked properties
  _publicAPIActions = {
    search: this._search,
    highlight: this._highlight,
    select: this._select,
    choose: this._choose,
    scrollTo: this._scrollTo
  }

  // Tracked properties
  @tracked _resolvedOptions
  @tracked _resolvedSelected
  @tracked lastSearchedText
  @tracked isActive = false
  @tracked _repeatingChar = ''
  @tracked _expirableSearchText = ''
  @tracked loading = false
  storedAPI = undefined

  // Getters
  get highlightOnHover() {
    return this.args.highlightOnHover === undefined ? true : this.args.highlightOnHover
  }
  get placeholderComponent() {
    return this.args.placeholderComponent || 'power-select/placeholder';
  }

  get searchMessage() {
    return this.args.searchMessage === undefined ? 'Type to search' : this.args.searchMessage;
  }

  get noMatchesMessage() {
    return this.args.noMatchesMessage === undefined ? 'No results found' : this.args.noMatchesMessage;
  }

  get matchTriggerWidth() {
    return this.args.matchTriggerWidth === undefined ? true : this.args.matchTriggerWidth;
  }

  get mustShowSearchMessage() {
    return !this.loading && this.searchText.length === 0
      && !!this.args.search && !!this.searchMessage
      && this.resultsCount === 0;
  }

  get mustShowNoMessages() {
    return !this.loading
      && this.resultsCount === 0
      && (!this.args.search || this.lastSearchedText.length > 0);
  }

  // PublicAPI
  @tracked searchText = ''
  @tracked lastSearchedText = ''
  @tracked _highlighted = undefined
  @tracked _searchResult

  get results() {
    if (this.searchText.length > 0) {
      if (this.args.search) {
        return this._searchResult || this.options;
      } else {
        return this._filter(this.options, this.searchText);
      }
    } else {
      return this.options;
    }
  }

  get options() {
    return this._resolvedOptions || this.args.options;
  }

  get resultsCount() {
    return countOptions(this.results);
  }

  get selected() {
    if (this._resolvedSelected) {
      return this._resolvedSelected;
    } else if (this.args.selected && typeof this.args.selected.then !== 'function') {
      return this.args.selected;
    }
    return undefined;
  }

  get highlighted() {
    return this._highlighted; // || this.selected || (this.results && this.results[0]);
  }

  // Actions
  @action
  handleOpen(_, e) {
    if (this.args.onOpen && this.args.onOpen(this.storedAPI, e) === false) {
      return false;
    }
    if (e) {
      this.openingEvent = e;
      if (e.type === 'keydown' && (e.keyCode === 38 || e.keyCode === 40)) {
        e.preventDefault();
      }
    }
    this._resetHighlighted();
  }

  @action
  handleClose(select, e) {
    if (this.args.onClose && this.args.onClose(this.storedAPI, e) === false) {
      return false;
    }
    if (e) {
      this.openingEvent = null;
    }
    this._highlight(undefined);
  }

  @action
  handleInput(e) {
    let term = e.target.value;
    let correctedTerm;
    if (this.args.onInput) {
      correctedTerm = this.args.onInput(term, this.storedAPI, e);
      if (correctedTerm === false) {
        return;
      }
    }
    this._publicAPIActions.search(typeof correctedTerm === 'string' ? correctedTerm : term);
  }

  @action
  handleKeydown(e) {
    if (this.args.onKeydown && this.args.onKeydown(this.storedAPI, e) === false) {
      return false;
    }
    return this._routeKeydown(this.storedAPI, e);
  }

  @action
  handleTriggerKeydown(e) {
    if (this.args.onKeydown && this.args.onKeydown(this.storedAPI, e) === false) {
      e.stopImmediatePropagation();
      return;
    }
    if (e.ctrlKey || e.metaKey) {
      e.stopImmediatePropagation();
      return;
    }
    if ((e.keyCode >= 48 && e.keyCode <= 90) || isNumpadKeyEvent(e)) { // Keys 0-9, a-z or numpad keys
      this.triggerTypingTask.perform(e);
    } else if (e.keyCode === 32) {  // Space
      this._handleKeySpace(this.storedAPI, e);
    } else {
      return this._routeKeydown(this.storedAPI, e);
    }
  }

  @action
  handleFocus(event) {
    if (!this.isDestroying) {
      this.isActive = true;
    }
    if (this.args.onFocus) {
      this.args.onFocus(this.storedAPI, event);
    }
  }

  @action
  handleBlur() {
    if (!this.isDestroying) {
      this.isActive = false;
    }
    if (this.args.onBlur) {
      this.args.onBlur(this.storedAPI, event);
    }
  }

  // Methods
  @action
  _search(term) {
    if (this.searchText === term) return;
    this.searchText = term;
    if (!this.args.search) {
      this.lastSearchedText = term;
      this._resetHighlighted();
    }
  }

  @action
  _updateOptions() {
    if (!this.args.options) return
    if (typeof this.args.options.then === 'function') {
      if (this._lastOptionsPromise === this.args.options) return; // promise is still the same
      let currentOptionsPromise = this.args.options;
      this._lastOptionsPromise = currentOptionsPromise;
      this.loading = true;
      this._lastOptionsPromise.then(resolvedOptions => {
        if (this._lastOptionsPromise === currentOptionsPromise) {
          this.loading = false;
          this._resolvedOptions = resolvedOptions;
          this._resetHighlighted();
        }
      }).catch(() => {
        if (this._lastOptionsPromise === currentOptionsPromise) {
          this.loading = false;
        }
      });
    } else {
      scheduleOnce('actions', this, this._resetHighlighted);
    }
  }

  @action
  _updateHighlighted() {
    if (this.storedAPI.isOpen) {
      this._resetHighlighted();
    }
  }

  @action
  _updateSelected() {
    if (!this.args.selected) return;
    if (typeof this.args.selected.then === 'function') {
      if (this._lastSelectedPromise === this.args.selected) return; // promise is still the same
      let currentSelectedPromise = this.args.selected;
      if (Object.hasOwnProperty.call(currentSelectedPromise, 'content')) { // seems a PromiseProxy
        if (this._lastSelectedPromise) {
          removeObserver(this._lastSelectedPromise, 'content', this._selectedObserverCallback);
        }
        addObserver(currentSelectedPromise, 'content', this, this._selectedObserverCallback);
      }
      this._lastSelectedPromise = currentSelectedPromise;
      this._lastSelectedPromise.then(resolvedSelected => {
        if (this._lastSelectedPromise === currentSelectedPromise) {
          this._resolvedSelected = resolvedSelected;
          this._highlight(resolvedSelected)
        }
      });
    } else {
      this._resolvedSelected = undefined;
      this._highlight(this.args.selected)
    }
  }

  _selectedObserverCallback() {
    this._resolvedSelected = this._lastSelectedPromise;
    this._highlight(this._resolvedSelected)
  }

  @action
  _highlight(opt) {
    if (opt && get(opt, 'disabled')) {
      return;
    }
    this._highlighted = opt;
  }

  @action
  _select(selected, e) {
    if (!isEqual(this.storedAPI.selected, selected)) {
      this.args.onChange(selected, this.storedAPI, e);
    }
  }

  @action
  _choose(selected, e) {
    let selection = this.args.buildSelection ? this.args.buildSelection(selected, this.storedAPI) : selected;
    this.storedAPI.actions.select(selection, e);
    if (this.args.closeOnSelect !== false) {
      this.storedAPI.actions.close(e);
      // return false;
    }
  }

  @action
  _scrollTo(option) {
    let select = this.storedAPI;
    if (!document || !option) {
      return;
    }
    if (this.args.scrollTo) {
      return this.args.scrollTo(option, select);
    }
    let optionsList = document.querySelector(`[aria-controls="ember-power-select-trigger-${select.uniqueId}"]`);
    if (!optionsList) {
      return;
    }
    let index = indexOfOption(select.results, option);
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
  }

  @action
  _registerAPI(_, [publicAPI]) {
    this.storedAPI = publicAPI;
    if (this.args.registerAPI) {
      scheduleOnce('actions', this.args.registerAPI, publicAPI);
    }
  }

  @action
  _performSearch(_, [term]) {
    if (!this.args.search) return;
    if (term === '') {
      this.loading = false;
      this.lastSearchedText = term;
      if (this._lastSearchPromise !== undefined) {
        if (typeof this._lastSearchPromise.cancel === 'function') {
          this._lastSearchPromise.cancel(); // Cancel ember-concurrency tasks
        }
        this._lastSearchPromise = undefined;
      }
      return;
    }
    let searchResult = this.args.search(term, this.storedAPI);
    if (searchResult && typeof searchResult.then === 'function') {
      this.loading = true;
      if (this._lastSearchPromise !== undefined && typeof this._lastSearchPromise.cancel === 'function') {
        this._lastSearchPromise.cancel(); // Cancel ember-concurrency tasks
      }
      this._lastSearchPromise = searchResult;
      searchResult.then(results => {
        if (this._lastSearchPromise === searchResult) {
          this._searchResult = results;
          this.loading = false;
          this.lastSearchedText = term;
          this._resetHighlighted();
        }
      }).catch(() => {
        if (this._lastSearchPromise === searchResult) {
          this.loading = false;
          this.lastSearchedText = term;
        }
      });
    } else {
      this.lastSearchedText = term;
      this._searchResult = searchResult;
    }
  }

  _defaultBuildSelection(option) {
    return option
  }

  _routeKeydown(select, e) {
    if (e.keyCode === 38 || e.keyCode === 40) { // Up & Down
      return this._handleKeyUpDown(select, e);
    } else if (e.keyCode === 13) {  // ENTER
      return this._handleKeyEnter(select, e);
    } else if (e.keyCode === 9) {   // Tab
      return this._handleKeyTab(select, e);
    } else if (e.keyCode === 27) {  // ESC
      // return this._handleKeyESC(e);
    }
  }

  _handleKeyTab(select, e) {
    select.actions.close(e);
  }

  _handleKeyEnter(select, e) {
    if (select.isOpen && select.highlighted !== undefined) {
      select.actions.choose(select.highlighted, e);
      e.stopImmediatePropagation();
      return false;
    }
  }

  _handleKeySpace(select, e) {
    if (['TEXTAREA', 'INPUT'].includes(e.target.nodeName)) {
      e.stopImmediatePropagation();
    } else if (select.isOpen && select.highlighted !== undefined) {
      e.stopImmediatePropagation();
      e.preventDefault(); // Prevents scrolling of the page.
      select.actions.choose(select.highlighted, e);
    }
  }

  _handleKeyUpDown(select, e) {
    if (select.isOpen) {
      e.preventDefault();
      e.stopPropagation();
      let step = e.keyCode === 40 ? 1 : -1;
      let newHighlighted = advanceSelectableOption(select.results, select.highlighted, step);
      select.actions.highlight(newHighlighted, e);
      select.actions.scrollTo(newHighlighted, select);
    } else {
      select.actions.open(e);
    }
  }

  _resetHighlighted() {
    let highlighted;
    let defHighlighted = this.args.defaultHighlighted || defaultHighlighted;
    if (typeof defHighlighted === 'function') {
      highlighted = defHighlighted({ results: this.results, highlighted: this._highlighted, selected: this.selected});
    } else {
      highlighted = defHighlighted
    }
    this._highlight(highlighted);
  }

  _filter(options, term, skipDisabled = false) {
    let optionMatcher = getOptionMatcher(this.args.matcher || defaultMatcher, defaultMatcher, this.args.searchField);
    return filterOptions(options || [], term, optionMatcher, skipDisabled);
  }


  findWithOffset(options, term, offset, skipDisabled = false) {
    let typeAheadOptionMatcher = getOptionMatcher(this.args.typeAheadOptionMatcher || defaultTypeAheadMatcher, defaultTypeAheadMatcher, this.args.searchField);
    return findOptionWithOffset(options || [], term, typeAheadOptionMatcher, offset, skipDisabled);
  }

  // Tasks
  @(task(function* (e) {
    // In general, a user doing this interaction means to have a different result.
    let searchStartOffset = 1;
    // let repeatingChar = this.storedAPI._repeatingChar;
    let charCode = e.keyCode;
    if (isNumpadKeyEvent(e)) {
      charCode -= 48; // Adjust char code offset for Numpad key codes. Check here for numapd key code behavior: https://goo.gl/Qwc9u4
    }

    // Check if user intends to cycle through results. _repeatingChar can only be the first character.
    let c = String.fromCharCode(charCode);
    if (c === this._repeatingChar) {
      this._expirableSearchText = c;
    } else {
      this._expirableSearchText += c;
    }
    if (this._expirableSearchText.length > 1) {
      // If the expirable search text is longer than one char, the user is in the middle of a non-cycling interaction
      // so the offset is just zero (the current selection is a valid match).
      searchStartOffset = 0;
      this.repeatingChar = '';
    } else {
      this.repeatingChar = c;
    }

    // When the select is open, the "selection" is just highlighted.
    if (this.storedAPI.isOpen && this.storedAPI.highlighted) {
      searchStartOffset += indexOfOption(this.storedAPI.result, this.storedAPI.highlighted);
    } else if (!this.storedAPI.isOpen && this.storedAPI.selected) {
      searchStartOffset += indexOfOption(this.storedAPI.result, this.storedAPI.selected);
    } else {
      searchStartOffset = 0;
    }

    // The char is always appended. That way, searching for words like "Aaron" will work even
    // if "Aa" would cycle through the results.
    let match = this.findWithOffset(this.storedAPI.results, this._expirableSearchText, searchStartOffset, true);
    if (match !== undefined) {
      if (this.storedAPI.isOpen) {
        this.storedAPI.actions.highlight(match, e);
        this.storedAPI.actions.scrollTo(match, this.storedAPI);
      } else {
        this.storedAPI.actions.select(match, e);
      }
    }
    yield timeout(1000);
    this._expirableSearchText = '';
    this._repeatingChar = '';
  }).restartable()) triggerTypingTask
}

function getOptionMatcher(matcher, defaultMatcher, searchField) {
  if (searchField && matcher === defaultMatcher) {
    return (option, text) => matcher(get(option, searchField), text);
  } else {
    return (option, text) => {
      assert('<PowerSelect> If you want the default filtering to work on options that are not plain strings, you need to provide `@searchField`', matcher !== defaultMatcher || typeof option === 'string');
      return matcher(option, text);
    };
  }
}

function isNumpadKeyEvent(e) {
  return e.keyCode >= 96 && e.keyCode <= 105;
}

// // import { layout, tagName } from "@ember-decorators/component";
// // import Component from '@ember/component';
// import Component from '@glimmer/component';
// import { tracked } from '@glimmer/tracking';
// import { computed, action } from '@ember/object';
// import { scheduleOnce } from '@ember/runloop';
// import { getOwner } from '@ember/application';
// import { isEqual } from '@ember/utils';
// import { get, set } from '@ember/object';
// import { assert } from '@ember/debug';
// import { DEBUG } from '@glimmer/env';
// import { isBlank } from '@ember/utils';
// import { isArray as isEmberArray } from '@ember/array';
// import ArrayProxy from '@ember/array/proxy';
// import ObjectProxy from '@ember/object/proxy';
// // import templateLayout from '../templates/components/power-select';
// import fallbackIfUndefined from '../utils/computed-fallback-if-undefined';
// import optionsMatcher from '../utils/computed-options-matcher';
// import { assign } from '@ember/polyfills';

// import {
//   defaultMatcher,
//   indexOfOption,
//   filterOptions,
//   findOptionWithOffset,
//   countOptions,
//   defaultHighlighted,
//   advanceSelectableOption,
//   defaultTypeAheadMatcher
// } from '../utils/group-utils';
// import { task, timeout } from 'ember-concurrency';

// function concatWithProperty(strings, property) {
//   if (property) {
//     strings.push(property);
//   }
//   return strings.join(' ');
// }

// function toPlainArray(collection) {
//   return collection.toArray ? collection.toArray() : collection;
// }

// // const initialState = {
// //   options: [],              // Contains the resolved collection of options
// //   results: [],              // Contains the active set of results
// //   resultsCount: 0,          // Contains the number of results incuding those nested/disabled
// //   selected: undefined,      // Contains the resolved selected option
// //   highlighted: undefined,   // Contains the currently highlighted option (if any)
// //   searchText: '',           // Contains the text of the current search
// //   lastSearchedText: '',     // Contains the text of the last finished search
// //   loading: false,           // Truthy if there is a pending promise that will update the results
// //   isActive: false,          // Truthy if the trigger is focused. Other subcomponents can mark it as active depending on other logic.
// //   // Private API (for now)
// //   _expirableSearchText: '',
// //   _repeatingChar: ''
// // };

// export default class PowerSelect extends Component {
//   @fallbackIfUndefined(true) matchTriggerWidth
//   @fallbackIfUndefined(false) preventScroll
//   @fallbackIfUndefined(defaultMatcher) matcher
//   @fallbackIfUndefined('Loading options...') loadingMessage
//   @fallbackIfUndefined('No results found') noMatchesMessage
//   @fallbackIfUndefined('Type to search') searchMessage
//   @fallbackIfUndefined(defaultHighlighted) defaultHighlighted
//   @fallbackIfUndefined(defaultTypeAheadMatcher) typeAheadMatcher
//   @fallbackIfUndefined(true) highlightOnHover
//   @fallbackIfUndefined(null) afterOptionsComponent
//   @fallbackIfUndefined('power-select/before-options') beforeOptionsComponent
//   @fallbackIfUndefined('power-select/options') optionsComponent
//   @fallbackIfUndefined('power-select/power-select-group') groupComponent
//   @fallbackIfUndefined('power-select/trigger') triggerComponent
//   @fallbackIfUndefined('power-select/search-message') searchMessageComponent
//   @fallbackIfUndefined('power-select/placeholder') placeholderComponent
//   @fallbackIfUndefined(option => option) buildSelection
//   @fallbackIfUndefined("button") triggerRole
//   @tracked optionsId
//   @tracked _dropdownAPI = {}
//   @tracked _highlighted = undefined   // Contains the currently highlighted option (if any)
//   @tracked _searchText = ''           // Contains the text of the current search
//   @tracked _lastSearchedText = ''     // Contains the text of the last finished search
//   @tracked _isActive = false          // Truthy if the trigger is focused. Other subcomponents can mark it as active depending on other logic.
//   @tracked _expirableSearchText = ''
//   @tracked _repeatingChar = ''
//   @tracked _searchResult = undefined

//   @tracked _resolvedOptionsPromise = undefined
//   @tracked _resolvedOptions = undefined
//   get _options() {
//     return this.args.options;
//   }
//   get _loading() {
//     return !!this.args.options &&
//       !!this.args.options.then &&
//       this.args.options !== this._resolvedOptionsPromise;
//   }

//   get _selected() {
//     return this.args.selected;
//   }

//   get _results() {
//     if (this.args.search) {
//       if (!this._searchResult) {
//         this._lastSearchedText = this._searchText;
//         return this._options;
//       } else if (get(this._searchResult, 'then')) {
//         assert('returning promises from the search function is not allowed yet', false);
//         return [];
//       } else {
//         this._lastSearchedText = this._searchText;
//         scheduleOnce('actions', this, '_resetHighlighted');
//         return toPlainArray(this._searchResult);
//       }
//     } else if (this._searchText.length > 0) {
//       return this.filter(this._options, this._searchText);
//     } else {
//       return this._options;
//     }
//   }

//   get _resultsCount() {
//     return countOptions(this._results);
//   }

//   // Lifecycle hooks
//   constructor() {
//     super(...arguments);
//     this._publicAPIActions = {
//       search: this._search,
//       highlight: this._highlight,
//       select: this._select,
//       choose: this._choose,
//       scrollTo: this._scrollTo
//     }
//     assert('<PowerSelect> requires an `@onChange` function', this.args.onChange && typeof this.args.onChange === 'function');
//   }

//   willDestroy() {
//     super.willDestroy(...arguments);
//     this._removeObserversInOptions();
//     this._removeObserversInSelected();
//     if (this.args.registerAPI) {
//       this.args.registerAPI(null);
//     }
//   }

//   // CPs
//   get publicAPI() {
//     return assign({}, this._dropdownAPI, {
//       actions: assign({}, this._dropdownAPI.actions, this._publicAPIActions),
//       options: this._options,
//       results: this._results,
//       resultsCount: this._resultsCount,
//       selected: this._selected,
//       highlighted: this._highlighted,
//       searchText: this._searchText,
//       lastSearchedText: this._lastSearchedText,
//       loading: this._loading,
//       isActive: this._isActive,
//       // Private API (for now)
//       _expirableSearchText: this._expirableSearchText,
//       _repeatingChar: this._repeatingChar
//     });
//   }

//   get inTesting() {
//     let config = getOwner(this).resolveRegistration('config:environment');
//     return config.environment === 'test';
//   }

//   // @computed
//   // get selected() {
//   //     return null;
//   // }
//   // set selected(selected) {
//   //   if (selected && !(selected instanceof ObjectProxy) && get(selected, 'then')) {
//   //     this._updateSelectedTask.perform(selected);
//   //   } else {
//   //     scheduleOnce('actions', this, this.updateSelection, selected);
//   //   }
//   //   return selected;
//   // }

//   // @computed
//   get options() {
//     return this.args.options;
//     // let oldOptions = this.oldOptions;
//     // this.oldOptions = this.args.options;
//     // if (this.args.options === oldOptions) {
//     //   return this.args.options;
//     // }
//     // if (options && get(options, 'then')) {
//     //   this._updateOptionsTask.perform(options);
//     // } else {
//     //   scheduleOnce('actions', this, this.updateOptions, options);
//     // }
//     // return options;
//     // return [];
//   }
//   // set options(options) {
//   //   let oldOptions = this.oldOptions;
//   //   this.oldOptions = options;
//   //   if (options === oldOptions) {
//   //     return options;
//   //   }
//   //   if (options && get(options, 'then')) {
//   //     this._updateOptionsTask.perform(options);
//   //   } else {
//   //     scheduleOnce('actions', this, this.updateOptions, options);
//   //   }
//   //   return options;
//   // }

//   @optionsMatcher('matcher', defaultMatcher) optionMatcher
//   @optionsMatcher('typeAheadMatcher', defaultTypeAheadMatcher) typeAheadOptionMatcher

//   @computed('triggerClass', 'publicAPI.isActive')
//   get concatenatedTriggerClasses() {
//     let classes = ['ember-power-select-trigger'];
//     if (this.publicAPI.isActive) {
//       classes.push('ember-power-select-trigger--active');
//     }
//     return concatWithProperty(classes, this.triggerClass);
//   }

//   @computed('args.dropdownClass', 'publicAPI.isActive')
//   get concatenatedDropdownClasses() {
//     let classes = ['ember-power-select-dropdown'];
//     if (this.publicAPI.isActive) {
//       classes.push('ember-power-select-dropdown--active');
//     }
//     return concatWithProperty(classes, this.args.dropdownClass);
//   }

//   @computed('publicAPI.{loading,searchText,resultsCount}', 'search', 'searchMessage')
//   get mustShowSearchMessage() {
//     return !this.publicAPI.loading && this.publicAPI.searchText.length === 0
//       && !!this.search && !!this.searchMessage
//       && this.publicAPI.resultsCount === 0;
//   }

//   // @computed('search', 'publicAPI.{lastSearchedText,resultsCount,loading}')
//   get mustShowNoMessages() {
//     return !this.publicAPI.loading
//       && this.publicAPI.resultsCount === 0
//       && (!this.args.search || this.publicAPI.lastSearchedText.length > 0);
//   }

//   // Actions
//   @action
//   _registerAPI(dropdown) {
//     if (!dropdown) {
//       return;
//     }
//     this._dropdownAPI = dropdown;
//     this.optionsId = `ember-power-select-options-${this.publicAPI.uniqueId}`
//     if (this.registerAPI) {
//       this.registerAPI(this.publicAPI);
//     }
//   }

//   @action
//   handleOpen(_, e) {
//     if (this.args.onOpen && this.args.onOpen(this.publicAPI, e) === false) {
//       return false;
//     }
//     if (e) {
//       this.openingEvent = e;
//       if (e.type === 'keydown' && (e.keyCode === 38 || e.keyCode === 40)) {
//         e.preventDefault();
//       }
//     }
//     this._resetHighlighted();
//   }

//   @action
//   handleClose(_, e) {
//     if (this.args.onClose && this.args.onClose(this.publicAPI, e) === false) {
//       return false;
//     }
//     if (e) {
//       this.openingEvent = null;
//     }
//     this._highlighted = undefined;
//   }

//   @action
//   handleInput(e) {
//     let term = e.target.value;
//     let correctedTerm;
//     if (this.onInput) {
//       correctedTerm = this.onInput(term, this.publicAPI, e);
//       if (correctedTerm === false) {
//         return;
//       }
//     }
//     this.publicAPI.actions.search(typeof correctedTerm === 'string' ? correctedTerm : term);
//   }

//   @action
//   _highlight(option /* , e */) {
//     if (option && get(option, 'disabled')) {
//       return;
//     }
//     this._highlighted = option;
//   }

//   @action
//   _select(selected, e) {
//     if (!isEqual(this.publicAPI.selected, selected)) {
//       this.args.onChange(selected, this.publicAPI, e);
//     }
//   }

//   @action
//   _search(term) {
//     if (this.isDestroying) {
//       return;
//     }
//     this._searchText = term;
//     if (this.args.search) {
//       this._searchResult = this.args.search(term, this.publicAPI);
//     }
//     // if (this.args.search) {
//     //   this._performSearch(term);
//     // } else {
//     //   this._searchText = this._lastSearchedText = term;
//     // }
//   }

//   @action
//   _choose(selected, e) {
//     if (!this.inTesting) {
//       if (e && e.clientY) {
//         if (this.openingEvent && this.openingEvent.clientY) {
//           if (Math.abs(this.openingEvent.clientY - e.clientY) < 2) {
//             return;
//           }
//         }
//       }
//     }
//     this.publicAPI.actions.select(this.buildSelection(selected, this.publicAPI), e);
//     if (this.args.closeOnSelect !== false) {
//       this.publicAPI.actions.close(e);
//       return false;
//     }
//   }

//   // keydowns handled by the trigger provided by ember-basic-dropdown
//   @action
//   handleTriggerKeydown(e) {
//     if (this.onKeydown && this.onKeydown(this.publicAPI, e) === false) {
//       e.stopImmediatePropagation();
//       return;
//     }
//     if (e.ctrlKey || e.metaKey) {
//       e.stopImmediatePropagation();
//       return;
//     }
//     if ((e.keyCode >= 48 && e.keyCode <= 90) // Keys 0-9, a-z
//       || this._isNumpadKeyEvent(e)) {
//       this.triggerTypingTask.perform(e);
//     } else if (e.keyCode === 32) {  // Space
//       this._handleKeySpace(e);
//     } else {
//       return this._routeKeydown(e);
//     }
//   }

//   // keydowns handled by inputs inside the component
//   @action
//   handleKeydown(e) {
//     if (this.onKeydown && this.onKeydown(this.publicAPI, e) === false) {
//       return false;
//     }
//     return this._routeKeydown(e);
//   }

//   @action
//   _scrollTo(option, ...rest) {
//     if (!document || !option) {
//       return;
//     }
//     if (this.scrollTo) {
//       return this.scrollTo(option, this.publicAPI, ...rest);
//     }
//     let optionsList = document.getElementById(`ember-power-select-options-${this.publicAPI.uniqueId}`);
//     if (!optionsList) {
//       return;
//     }
//     let index = indexOfOption(this.publicAPI.results, option);
//     if (index === -1) {
//       return;
//     }
//     let optionElement = optionsList.querySelectorAll('[data-option-index]').item(index);
//     if (!optionElement) {
//       return;
//     }
//     let optionTopScroll = optionElement.offsetTop - optionsList.offsetTop;
//     let optionBottomScroll = optionTopScroll + optionElement.offsetHeight;
//     if (optionBottomScroll > optionsList.offsetHeight + optionsList.scrollTop) {
//       optionsList.scrollTop = optionBottomScroll - optionsList.offsetHeight;
//     } else if (optionTopScroll < optionsList.scrollTop) {
//       optionsList.scrollTop = optionTopScroll;
//     }
//   }

//   @action
//   handleTriggerFocus(event) {
//     if (!this.isDestroying) {
//       this._activate();
//     }
//     if (this.onFocus) {
//       this.onFocus(this.publicAPI, event);
//     }
//   }
//   @action
//   handleTriggerBlur(event) {
//     if (!this.isDestroying) {
//       this._deactivate();
//     }
//     if (this.onBlur) {
//       this.onBlur(this.publicAPI, event);
//     }
//   }

//   @action
//   handleFocus(event) {
//     this._activate();
//     if (this.onFocus) {
//       this.onFocus(this.publicAPI, event);
//     }
//   }

//   @action
//   handleBlur(event) {
//     if (!this.isDestroying) {
//       this._deactivate();
//     }
//     if (this.onBlur) {
//       this.onBlur(this.publicAPI, event);
//     }
//   }


//   // Tasks
//   @(task(function* (e) {
//     // In general, a user doing this interaction means to have a different result.
//     let searchStartOffset = 1;
//     let repeatingChar = this.publicAPI._repeatingChar;
//     let charCode = e.keyCode;
//     if (this._isNumpadKeyEvent(e)) {
//       charCode -= 48; // Adjust char code offset for Numpad key codes. Check here for numapd key code behavior: https://goo.gl/Qwc9u4
//     }
//     let term;

//     // Check if user intends to cycle through results. _repeatingChar can only be the first character.
//     let c = String.fromCharCode(charCode);
//     if (c === this.publicAPI._repeatingChar) {
//       term = c;
//     } else {
//       term = this.publicAPI._expirableSearchText + c;
//     }

//     if (term.length > 1) {
//       // If the term is longer than one char, the user is in the middle of a non-cycling interaction
//       // so the offset is just zero (the current selection is a valid match).
//       searchStartOffset = 0;
//       repeatingChar = '';
//     } else {
//       repeatingChar = c;
//     }

//     // When the select is open, the "selection" is just highlighted.
//     if (this.publicAPI.isOpen && this.publicAPI.highlighted) {
//       searchStartOffset += indexOfOption(this.publicAPI.options, this.publicAPI.highlighted);
//     } else if (!this.publicAPI.isOpen && this.publicAPI.selected) {
//       searchStartOffset += indexOfOption(this.publicAPI.options, this.publicAPI.selected);
//     } else {
//       searchStartOffset = 0;
//     }

//     // The char is always appended. That way, searching for words like "Aaron" will work even
//     // if "Aa" would cycle through the results.
//     this.updateState({ _expirableSearchText: this.publicAPI._expirableSearchText + c, _repeatingChar: repeatingChar });
//     let match = this.findWithOffset(this.publicAPI.options, term, searchStartOffset, true);
//     if (match !== undefined) {
//       if (this.publicAPI.isOpen) {
//         this.publicAPI.actions.highlight(match, e);
//         this.publicAPI.actions.scrollTo(match, e);
//       } else {
//         this.publicAPI.actions.select(match, e);
//       }
//     }
//     yield timeout(1000);
//     this.updateState({ _expirableSearchText: '', _repeatingChar: '' });
//   }).restartable()) triggerTypingTask

//   @(task(function* (selectionPromise) {
//     let selection = yield selectionPromise;
//     this.updateSelection(selection);
//   }).restartable()) _updateSelectedTask

//   @(task(function* (optionsPromise) {
//     if (optionsPromise instanceof ArrayProxy) {
//       this.updateOptions(optionsPromise.get('content'));
//     }
//     this.updateState({ loading: true });
//     try {
//       let options = yield optionsPromise;
//       this.updateOptions(options);
//     } finally {
//       this.updateState({ loading: false });
//     }
//   }).restartable()) _updateOptionsTask

//   // @(task(function* (term, searchThenable) {
//   //   try {
//   //     this.updateState({ loading: true });
//   //     let results = yield searchThenable;
//   //     let resultsArray = toPlainArray(results);
//   //     this.updateState({
//   //       results: resultsArray,
//   //       _rawSearchResults: results,
//   //       lastSearchedText: term,
//   //       resultsCount: countOptions(results),
//   //       loading: false
//   //     });
//   //     this._resetHighlighted();
//   //   } catch(e) {
//   //     this.updateState({ lastSearchedText: term, loading: false });
//   //   } finally {
//   //     if (typeof searchThenable.cancel === 'function') {
//   //       searchThenable.cancel();
//   //     }
//   //   }
//   // }).restartable()) handleAsyncSearchTask

//   // Methods
//   _activate() {
//     scheduleOnce('actions', this, 'setIsActive', true);
//   }

//   _deactivate() {
//     scheduleOnce('actions', this, 'setIsActive', false);
//   }

//   setIsActive(isActive) {
//     this._isActive = isActive;
//   }

//   filter(options, term, skipDisabled = false) {
//     return filterOptions(options || [], term, this.optionMatcher, skipDisabled);
//   }

//   findWithOffset(options, term, offset, skipDisabled = false) {
//     return findOptionWithOffset(options || [], term, this.typeAheadOptionMatcher, offset, skipDisabled);
//   }

//   // updateOptions(options) {
//   //   this._removeObserversInOptions();
//   //   if (!options) {
//   //     return;
//   //   }
//   //   if (DEBUG) {
//   //     (function walk(collection) {
//   //       for (let i = 0; i < get(collection, 'length'); i++) {
//   //         let entry = collection.objectAt ? collection.objectAt(i) : collection[i];
//   //         let subOptions = get(entry, 'options');
//   //         let isGroup = !!get(entry, 'groupName') && !!subOptions;
//   //         if (isGroup) {
//   //           assert('ember-power-select doesn\'t support promises inside groups. Please, resolve those promises and turn them into arrays before passing them to ember-power-select', !get(subOptions, 'then'));
//   //           walk(subOptions);
//   //         }
//   //       }
//   //     })(options);
//   //   }
//   //   if (options && options.addObserver) {
//   //     options.addObserver('[]', this, this._updateOptionsAndResults);
//   //     this._observedOptions = options;
//   //   }
//   //   this._updateOptionsAndResults(options);
//   // }

//   // updateSelection(selection) {
//   //   this._removeObserversInSelected();
//   //   if (isEmberArray(selection)) {
//   //     if (selection && selection.addObserver) {
//   //       selection.addObserver('[]', this, this._updateSelectedArray);
//   //       this._observedSelected = selection;
//   //     }
//   //     this._updateSelectedArray(selection);
//   //   } else if (selection !== this.publicAPI.selected) {
//   //     this.updateState({ selected: selection, highlighted: selection });
//   //   }
//   // }

//   _resetHighlighted() {
//     let highlighted;
//     if (typeof this.defaultHighlighted === 'function') {
//       highlighted = this.defaultHighlighted(this.publicAPI);
//     } else {
//       highlighted = this.defaultHighlighted;
//     }
//     this._highlighted = highlighted;
//   }

//   // _updateOptionsAndResults(opts) {
//   //   if (get(this, 'isDestroying')) {
//   //     return;
//   //   }
//   //   let options = toPlainArray(opts);
//   //   let publicAPI;
//   //   if (this.args.search) { // external search
//   //     publicAPI = this.updateState({ options, results: options, resultsCount: countOptions(options), loading: false });
//   //   } else { // filter
//   //     publicAPI = this.publicAPI;
//   //     let results = isBlank(publicAPI.searchText) ? options : this.filter(options, publicAPI.searchText);
//   //     publicAPI = this.updateState({ results, options, resultsCount: countOptions(results), loading: false });
//   //   }
//   //   if (publicAPI.isOpen) {
//   //     this._resetHighlighted();
//   //   }
//   // }

//   _updateSelectedArray(selection) {
//     if (get(this, 'isDestroyed')) {
//       return;
//     }
//     this.updateState({ selected: toPlainArray(selection) });
//   }

//   _resetSearch() {
//     // this.handleAsyncSearchTask.cancelAll();
//     // this._searchText = this._lastSearchedText = '';
//     this._searchText = '';
//     // this.updateState({
//     //   results,
//     //   searchText: '',
//     //   lastSearchedText: '',
//     //   resultsCount: countOptions(results),
//     //   loading: false
//     // });
//   }

//   // _performFilter(term) {
//   //   let results = this.filter(this.publicAPI.options, term);
//   //   this.updateState({ results, searchText: term, lastSearchedText: term, resultsCount: countOptions(results) });
//   //   this._resetHighlighted();
//   // }

//   _performSearch(term) {
//     // let searchAction = this.args.search;
//     // this._searchText = term;
//     // let search = searchAction(term, this.publicAPI);
//     // if (!search) {
//     //   this._lastSearchedText = term;
//     // } else if (get(search, 'then')) {
//     //   debugger;
//     //   this.handleAsyncSearchTask.perform(term, search);
//     // } else {
//     //   this._searchResults = toPlainArray(search);
//     //   this._lastSearchedText = term;
//     //   this._resetHighlighted();
//     // }
//   }

//   _routeKeydown(e) {
//     if (e.keyCode === 38 || e.keyCode === 40) { // Up & Down
//       return this._handleKeyUpDown(e);
//     } else if (e.keyCode === 13) {  // ENTER
//       return this._handleKeyEnter(e);
//     } else if (e.keyCode === 9) {   // Tab
//       return this._handleKeyTab(e);
//     } else if (e.keyCode === 27) {  // ESC
//       return this._handleKeyESC(e);
//     }
//   }

//   _handleKeyUpDown(e) {
//     if (this.publicAPI.isOpen) {
//       e.preventDefault();
//       e.stopPropagation();
//       let step = e.keyCode === 40 ? 1 : -1;
//       let newHighlighted = advanceSelectableOption(this.publicAPI.results, this.publicAPI.highlighted, step);
//       this.publicAPI.actions.highlight(newHighlighted, e);
//       this.publicAPI.actions.scrollTo(newHighlighted);
//     } else {
//       this.publicAPI.actions.open(e);
//     }
//   }

//   _handleKeyEnter(e) {
//     if (this.publicAPI.isOpen && this.publicAPI.highlighted !== undefined) {
//       this.publicAPI.actions.choose(this.publicAPI.highlighted, e);
//       e.stopImmediatePropagation();
//       return false;
//     }
//   }

//   _handleKeySpace(e) {
//     if (['TEXTAREA', 'INPUT'].includes(e.target.nodeName)) {
//       e.stopImmediatePropagation();
//     } else if (this.publicAPI.isOpen && this.publicAPI.highlighted !== undefined) {
//       e.stopImmediatePropagation();
//       e.preventDefault(); // Prevents scrolling of the page.
//       this.publicAPI.actions.choose(this.publicAPI.highlighted, e);
//     }
//   }

//   _handleKeyTab(e) {
//     this.publicAPI.actions.close(e);
//   }

//   _handleKeyESC(e) {
//     this.publicAPI.actions.close(e);
//   }

//   _removeObserversInOptions() {
//     if (this._observedOptions) {
//       this._observedOptions.removeObserver('[]', this, this._updateOptionsAndResults);
//       this._observedOptions = undefined;
//     }
//   }

//   _removeObserversInSelected() {
//     if (this._observedSelected) {
//       this._observedSelected.removeObserver('[]', this, this._updateSelectedArray);
//       this._observedSelected = undefined;
//     }
//   }

//   _isNumpadKeyEvent(e) {
//     return e.keyCode >= 96 && e.keyCode <= 105;
//   }

//   // updateState(changes) {
//   //   let newState = set(this, 'publicAPI', assign({}, this.publicAPI, changes));
//   //   if (this.registerAPI) {
//   //     this.registerAPI(newState);
//   //   }
//   //   return newState;
//   // }
// }
