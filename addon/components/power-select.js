
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
  @tracked searchText = ''
  @tracked lastSearchedText = ''
  @tracked highlighted
  @tracked _searchResult
  storedAPI = undefined

  // Lifecycle hooks
  constructor() {
    super(...arguments);
    assert('<PowerSelect> requires an `@onChange` function', this.args.onChange && typeof this.args.onChange === 'function');
  }

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

  _filterResultsCache = { results: undefined, options: undefined, searchText: this.searchText };
  get results() {
    if (this.searchText.length > 0) {
      if (this.args.search) {
        return this._searchResult || this.options;
      } else {
        if (this._filterResultsCache.options === this.options && this._filterResultsCache.searchText === this.searchText) {
          // This is an optimization to avoid filtering several times, which may be a bit expensive
          // if there are many options, if neither the options nor the searchtext have changed
          return this._filterResultsCache.results;
        }
        let results = this._filter(this.options, this.searchText);
        this._filterResultsCache = { results, options: this.options, searchText: this.searchText };
        return results;
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
    this.highlighted = opt;
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
      highlighted = defHighlighted({ results: this.results, highlighted: this.highlighted, selected: this.selected});
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
    let repeatingChar = this._repeatingChar;
    let charCode = e.keyCode;
    if (isNumpadKeyEvent(e)) {
      charCode -= 48; // Adjust char code offset for Numpad key codes. Check here for numapd key code behavior: https://goo.gl/Qwc9u4
    }
    let term;

    // Check if user intends to cycle through results. _repeatingChar can only be the first character.
    let c = String.fromCharCode(charCode);
    if (c === this._repeatingChar) {
      term = c;
    } else {
      term = this._expirableSearchText + c;
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
    if (this.storedAPI.isOpen && this.storedAPI.highlighted) {
      searchStartOffset += indexOfOption(this.storedAPI.options, this.storedAPI.highlighted);
    } else if (!this.storedAPI.isOpen && this.selected) {
      searchStartOffset += indexOfOption(this.storedAPI.options, this.selected);
    } else {
      searchStartOffset = 0;
    }

    // The char is always appended. That way, searching for words like "Aaron" will work even
    // if "Aa" would cycle through the results.
    this._expirableSearchText = this._expirableSearchText + c;
    this._repeatingChar = repeatingChar;
    let match = this.findWithOffset(this.storedAPI.options, term, searchStartOffset, true);
    if (match !== undefined) {
      if (this.storedAPI.isOpen) {
        this.storedAPI.actions.highlight(match, e);
        this.storedAPI.actions.scrollTo(match, e);
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
