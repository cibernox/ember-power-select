import { layout, tagName } from "@ember-decorators/component";
import Component from '@ember/component';
import { computed } from '@ember/object';
import { scheduleOnce, throttle } from '@ember/runloop';
import { getOwner } from '@ember/application';
import { isEqual } from '@ember/utils';
import { get, set } from '@ember/object';
import { assert } from '@ember/debug';
import { DEBUG } from '@glimmer/env';
import { isBlank } from '@ember/utils';
import { isArray as isEmberArray } from '@ember/array';
import ArrayProxy from '@ember/array/proxy';
import ObjectProxy from '@ember/object/proxy';
import templateLayout from '../templates/components/power-select';
import fallbackIfUndefined from '../utils/computed-fallback-if-undefined';
import optionsMatcher from '../utils/computed-options-matcher';
import { assign } from '@ember/polyfills';

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

export default @tagName('') @layout(templateLayout) class PowerSelect extends Component {
  @fallbackIfUndefined(true) matchTriggerWidth
  @fallbackIfUndefined(false) preventScroll
  @fallbackIfUndefined(defaultMatcher) matcher
  @fallbackIfUndefined('Loading options...') loadingMessage
  @fallbackIfUndefined('No results found') noMatchesMessage
  @fallbackIfUndefined('Type to search') searchMessage
  @fallbackIfUndefined(true) closeOnSelect
  @fallbackIfUndefined(defaultHighlighted) defaultHighlighted
  @fallbackIfUndefined(defaultTypeAheadMatcher) typeAheadMatcher
  @fallbackIfUndefined(true) highlightOnHover
  @fallbackIfUndefined(null) afterOptionsComponent
  @fallbackIfUndefined('power-select/before-options') beforeOptionsComponent
  @fallbackIfUndefined('power-select/options') optionsComponent
  @fallbackIfUndefined('power-select/power-select-group') groupComponent
  @fallbackIfUndefined('power-select/trigger') triggerComponent
  @fallbackIfUndefined('power-select/search-message') searchMessageComponent
  @fallbackIfUndefined('power-select/placeholder') placeholderComponent
  @fallbackIfUndefined(option => option) buildSelection
  @fallbackIfUndefined("button") triggerRole
  publicAPI = initialState;

  // Lifecycle hooks
  init() {
    super.init(...arguments);
    this._publicAPIActions = {
      search: this._search,
      highlight: this._highlight,
      select: this._select,
      choose: this._choose,
      scrollTo: this._scrollTo
    }
    assert('<PowerSelect> requires an `@onChange` function', this.onChange && typeof this.onChange === 'function');
  }

  willDestroy() {
    super.willDestroy(...arguments);
    this._removeObserversInOptions();
    this._removeObserversInSelected();
    if (this.registerAPI) {
      this.registerAPI(null);
    }
  }

  // CPs
  @computed
  get inTesting() {
    let config = getOwner(this).resolveRegistration('config:environment');
    return config.environment === 'test';
  }

  @computed
  get selected() {
      return null;
  }
  set selected(selected) {
    if (selected && !(selected instanceof ObjectProxy) && get(selected, 'then')) {
      this._updateSelectedTask.perform(selected);
    } else {
      scheduleOnce('actions', this, this.updateSelection, selected);
    }
    return selected;
  }

  @computed
  get options() {
    return [];
  }
  set options(options) {
    let oldOptions = this.oldOptions;
    this.oldOptions = options;
    if (options === oldOptions) {
      return options;
    }
    if (options && get(options, 'then')) {
      this._updateOptionsTask.perform(options);
    } else {
      scheduleOnce('actions', this, this.updateOptions, options);
    }
    return options;
  }

  @optionsMatcher('matcher', defaultMatcher) optionMatcher
  @optionsMatcher('typeAheadMatcher', defaultTypeAheadMatcher) typeAheadOptionMatcher

  @computed('triggerClass', 'publicAPI.isActive')
  get concatenatedTriggerClasses() {
    let classes = ['ember-power-select-trigger'];
    if (this.publicAPI.isActive) {
      classes.push('ember-power-select-trigger--active');
    }
    return concatWithProperty(classes, this.triggerClass);
  }

  @computed('dropdownClass', 'publicAPI.isActive')
  get concatenatedDropdownClasses() {
    let classes = ['ember-power-select-dropdown'];
    if (this.publicAPI.isActive) {
      classes.push('ember-power-select-dropdown--active');
    }
    return concatWithProperty(classes, this.dropdownClass);
  }

  @computed('publicAPI.{loading,searchText,resultsCount}', 'search', 'searchMessage')
  get mustShowSearchMessage() {
    return !this.publicAPI.loading && this.publicAPI.searchText.length === 0
      && !!this.search && !!this.searchMessage
      && this.publicAPI.resultsCount === 0;
  }

  @computed('search', 'publicAPI.{lastSearchedText,resultsCount,loading}')
  get mustShowNoMessages() {
    return !this.publicAPI.loading
      && this.publicAPI.resultsCount === 0
      && (!this.search || this.publicAPI.lastSearchedText.length > 0);
  }

  // Actions
  @action
  _registerAPI(dropdown) {
    if (!dropdown) {
      return;
    }
    let publicAPI = assign({}, this.publicAPI, dropdown);
    publicAPI.actions = assign({}, dropdown.actions, this._publicAPIActions);
    this.setProperties({
      publicAPI,
      optionsId: `ember-power-select-options-${publicAPI.uniqueId}`
    });
    if (this.registerAPI) {
      this.registerAPI(publicAPI);
    }
  }

  @action
  handleOpen(_, e) {
    if (this.onOpen && this.onOpen(this.publicAPI, e) === false) {
      return false;
    }
    if (e) {
      this.set('openingEvent', e);
      if (e.type === 'keydown' && (e.keyCode === 38 || e.keyCode === 40)) {
        e.preventDefault();
      }
    }
    this._resetHighlighted();
  }

  @action
  handleClose(_, e) {
    if (this.onClose && this.onClose(this.publicAPI, e) === false) {
      return false;
    }
    if (e) {
      this.set('openingEvent', null);
    }
    this.updateState({ highlighted: undefined });
  }

  @action
  handleInput(e) {
    let term = e.target.value;
    let correctedTerm;
    if (this.onInput) {
      correctedTerm = this.onInput(term, this.publicAPI, e);
      if (correctedTerm === false) {
        return;
      }
    }
    this.publicAPI.actions.search(typeof correctedTerm === 'string' ? correctedTerm : term);
  }

  @action
  _highlight(option /* , e */) {
    if (option && get(option, 'disabled')) {
      return;
    }
    this.updateState({ highlighted: option });
  }

  @action
  _select(selected, e) {
    if (!isEqual(this.publicAPI.selected, selected)) {
      this.onChange(selected, this.publicAPI, e);
    }
  }

  @action
  _search(term) {
    if (this.isDestroying) {
      return;
    }
    if (isBlank(term)) {
      this._resetSearch();
    } else if (this.search) {
      this._performSearch(term);
    } else {
      this._performFilter(term);
    }
  }

  @action
  _choose(selected, e) {
    if (!this.inTesting) {
      if (e && e.clientY) {
        if (this.openingEvent && this.openingEvent.clientY) {
          if (Math.abs(this.openingEvent.clientY - e.clientY) < 2) {
            return;
          }
        }
      }
    }
    this.publicAPI.actions.select(this.buildSelection(selected, this.publicAPI), e);
    if (this.closeOnSelect) {
      this.publicAPI.actions.close(e);
      return false;
    }
  }

  // keydowns handled by the trigger provided by ember-basic-dropdown
  @action
  handleTriggerKeydown(e) {
    if (this.onKeydown && this.onKeydown(this.publicAPI, e) === false) {
      e.stopImmediatePropagation();
      return;
    }
    if (e.ctrlKey || e.metaKey) {
      e.stopImmediatePropagation();
      return;
    }
    if ((e.keyCode >= 48 && e.keyCode <= 90) // Keys 0-9, a-z
      || this._isNumpadKeyEvent(e)) {
      this.triggerTypingTask.perform(e);
    } else if (e.keyCode === 32) {  // Space
      this._handleKeySpace(e);
    } else {
      return this._routeKeydown(e);
    }
  }

  // keydowns handled by inputs inside the component
  @action
  handleKeydown(e) {
    if (this.onKeydown && this.onKeydown(this.publicAPI, e) === false) {
      return false;
    }
    return this._routeKeydown(e);
  }

  @action
  _scrollTo(option, ...rest) {
    if (!document || !option) {
      return;
    }
    if (this.scrollTo) {
      return this.scrollTo(option, this.publicAPI, ...rest);
    }
    let optionsList = document.getElementById(`ember-power-select-options-${this.publicAPI.uniqueId}`);
    if (!optionsList) {
      return;
    }
    let index = indexOfOption(this.publicAPI.results, option);
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
  handleTriggerFocus(event) {
    if (!this.isDestroying) {
      this._activate();
    }
    if (this.onFocus) {
      this.onFocus(this.publicAPI, event);
    }
  }
  @action
  handleTriggerBlur(event) {
    if (!this.isDestroying) {
      this._deactivate();
    }
    if (this.onBlur) {
      this.onBlur(this.publicAPI, event);
    }
  }

  @action
  onScroll(event) {
    let action = this.get('onscroll');
    if (action) {
      throttle(null, action, this.get('publicAPI'), event, 100, false);
    }
  },

  @action
  handleBlur(event) {
    if (!this.isDestroying) {
      this._deactivate();
    }
    if (this.onBlur) {
      this.onBlur(this.publicAPI, event);
    }
  }


  // Tasks
  @(task(function* (e) {
    // In general, a user doing this interaction means to have a different result.
    let searchStartOffset = 1;
    let repeatingChar = this.publicAPI._repeatingChar;
    let charCode = e.keyCode;
    if (this._isNumpadKeyEvent(e)) {
      charCode -= 48; // Adjust char code offset for Numpad key codes. Check here for numapd key code behavior: https://goo.gl/Qwc9u4
    }
    let term;

    // Check if user intends to cycle through results. _repeatingChar can only be the first character.
    let c = String.fromCharCode(charCode);
    if (c === this.publicAPI._repeatingChar) {
      term = c;
    } else {
      term = this.publicAPI._expirableSearchText + c;
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
    if (this.publicAPI.isOpen && this.publicAPI.highlighted) {
      searchStartOffset += indexOfOption(this.publicAPI.options, this.publicAPI.highlighted);
    } else if (!this.publicAPI.isOpen && this.publicAPI.selected) {
      searchStartOffset += indexOfOption(this.publicAPI.options, this.publicAPI.selected);
    } else {
      searchStartOffset = 0;
    }

    // The char is always appended. That way, searching for words like "Aaron" will work even
    // if "Aa" would cycle through the results.
    this.updateState({ _expirableSearchText: this.publicAPI._expirableSearchText + c, _repeatingChar: repeatingChar });
    let match = this.findWithOffset(this.publicAPI.options, term, searchStartOffset, true);
    if (match !== undefined) {
      if (this.publicAPI.isOpen) {
        this.publicAPI.actions.highlight(match, e);
        this.publicAPI.actions.scrollTo(match, e);
      } else {
        this.publicAPI.actions.select(match, e);
      }
    }
    yield timeout(1000);
    this.updateState({ _expirableSearchText: '', _repeatingChar: '' });
  }).restartable()) triggerTypingTask

  @(task(function* (selectionPromise) {
    let selection = yield selectionPromise;
    this.updateSelection(selection);
  }).restartable()) _updateSelectedTask

  @(task(function* (optionsPromise) {
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
  }).restartable()) _updateOptionsTask

  @(task(function* (term, searchThenable) {
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
      this._resetHighlighted();
    } catch(e) {
      this.updateState({ lastSearchedText: term, loading: false });
    } finally {
      if (typeof searchThenable.cancel === 'function') {
        searchThenable.cancel();
      }
    }
  }).restartable()) handleAsyncSearchTask

  // Methods
  _activate() {
    scheduleOnce('actions', this, 'setIsActive', true);
  }

  _deactivate() {
    scheduleOnce('actions', this, 'setIsActive', false);
  }

  setIsActive(isActive) {
    this.updateState({ isActive });
  }

  filter(options, term, skipDisabled = false) {
    return filterOptions(options || [], term, this.optionMatcher, skipDisabled);
  }

  findWithOffset(options, term, offset, skipDisabled = false) {
    return findOptionWithOffset(options || [], term, this.typeAheadOptionMatcher, offset, skipDisabled);
  }

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
  }

  updateSelection(selection) {
    this._removeObserversInSelected();
    if (isEmberArray(selection)) {
      if (selection && selection.addObserver) {
        selection.addObserver('[]', this, this._updateSelectedArray);
        this._observedSelected = selection;
      }
      this._updateSelectedArray(selection);
    } else if (selection !== this.publicAPI.selected) {
      this.updateState({ selected: selection, highlighted: selection });
    }
  }

  _resetHighlighted() {
    let highlighted;
    if (typeof this.defaultHighlighted === 'function') {
      highlighted = this.defaultHighlighted(this.publicAPI);
    } else {
      highlighted = this.defaultHighlighted;
    }
    this.updateState({ highlighted });
  }

  _updateOptionsAndResults(opts) {
    if (get(this, 'isDestroying')) {
      return;
    }
    let options = toPlainArray(opts);
    let publicAPI;
    if (this.search) { // external search
      publicAPI = this.updateState({ options, results: options, resultsCount: countOptions(options), loading: false });
    } else { // filter
      publicAPI = this.publicAPI;
      let results = isBlank(publicAPI.searchText) ? options : this.filter(options, publicAPI.searchText);
      publicAPI = this.updateState({ results, options, resultsCount: countOptions(results), loading: false });
    }
    if (publicAPI.isOpen) {
      this._resetHighlighted();
    }
  }

  _updateSelectedArray(selection) {
    if (get(this, 'isDestroyed')) {
      return;
    }
    this.updateState({ selected: toPlainArray(selection) });
  }

  _resetSearch() {
    let results = this.publicAPI.options;
    this.handleAsyncSearchTask.cancelAll();
    this.updateState({
      results,
      searchText: '',
      lastSearchedText: '',
      resultsCount: countOptions(results),
      loading: false
    });
  }

  _performFilter(term) {
    let results = this.filter(this.publicAPI.options, term);
    this.updateState({ results, searchText: term, lastSearchedText: term, resultsCount: countOptions(results) });
    this._resetHighlighted();
  }

  _performSearch(term) {
    let searchAction = this.search;
    let publicAPI = this.updateState({ searchText: term });
    let search = searchAction(term, publicAPI);
    if (!search) {
      publicAPI = this.updateState({ lastSearchedText: term });
    } else if (get(search, 'then')) {
      this.handleAsyncSearchTask.perform(term, search);
    } else {
      let resultsArray = toPlainArray(search);
      this.updateState({ results: resultsArray, lastSearchedText: term, resultsCount: countOptions(resultsArray) });
      this._resetHighlighted();
    }
  }

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
  }

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
  }

  _handleKeyEnter(e) {
    if (this.publicAPI.isOpen && this.publicAPI.highlighted !== undefined) {
      this.publicAPI.actions.choose(this.publicAPI.highlighted, e);
      e.stopImmediatePropagation();
      return false;
    }
  }

  _handleKeySpace(e) {
    if (['TEXTAREA', 'INPUT'].includes(e.target.nodeName)) {
      e.stopImmediatePropagation();
    } else if (this.publicAPI.isOpen && this.publicAPI.highlighted !== undefined) {
      e.stopImmediatePropagation();
      e.preventDefault(); // Prevents scrolling of the page.
      this.publicAPI.actions.choose(this.publicAPI.highlighted, e);
    }
  }

  _handleKeyTab(e) {
    this.publicAPI.actions.close(e);
  }

  _handleKeyESC(e) {
    this.publicAPI.actions.close(e);
  }

  _removeObserversInOptions() {
    if (this._observedOptions) {
      this._observedOptions.removeObserver('[]', this, this._updateOptionsAndResults);
      this._observedOptions = undefined;
    }
  }

  _removeObserversInSelected() {
    if (this._observedSelected) {
      this._observedSelected.removeObserver('[]', this, this._updateSelectedArray);
      this._observedSelected = undefined;
    }
  }

  _isNumpadKeyEvent(e) {
    return e.keyCode >= 96 && e.keyCode <= 105;
  }

  updateState(changes) {
    let newState = set(this, 'publicAPI', assign({}, this.publicAPI, changes));
    if (this.registerAPI) {
      this.registerAPI(newState);
    }
    return newState;
  }
}
