
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
  defaultTypeAheadMatcher,
  pathForOption,
  MatcherFn
} from '../utils/group-utils';
import { restartableTask } from 'ember-concurrency-decorators';
// @ts-ignore
import { timeout } from 'ember-concurrency';
import { Dropdown, DropdownActions } from 'ember-basic-dropdown/addon/components/basic-dropdown';

interface SelectActions extends DropdownActions {
  search: (term: string) => void
  highlight: (option: any) => void
  select: (selected: any, e?: Event) => void
  choose: (selected: any, e?: Event) => void
  scrollTo: (option: any) => void
}
export interface Select extends Dropdown {
  selected: any
  highlighted: any
  options: any[]
  results: any[]
  resultsCount: number
  loading: boolean
  isActive: boolean
  searchText: string
  lastSearchedText: string
  actions: SelectActions
}
interface PromiseProxy<T> extends Promise<T> {
  content: any
}
interface CancellablePromise<T> extends Promise<T> {
  cancel: () => void
}
interface Arrayable<T> {
  toArray(): T[];
}
interface Performable {
  perform: (...args: any[]) => void
}
// Some args are not listed here because they are only accessed from the template. Should I list them?
export interface PowerSelectArgs {
  highlightOnHover?: boolean
  placeholderComponent?: string
  searchMessage?: string
  searchMessageComponent?: string;
  noMatchesMessage?: string
  noMatchesMessageComponent?: string;
  matchTriggerWidth?: boolean
  options: any[] | PromiseProxy<any[]>
  selected: any | PromiseProxy<any>
  closeOnSelect?: boolean
  defaultHighlighted?: any
  searchField?: string
  searchEnabled?: boolean
  tabindex?: number | string
  triggerComponent?: string
  beforeOptionsComponent?: string
  optionsComponent?: string;
  groupComponent?: string;
  matcher?: MatcherFn
  initiallyOpened?: boolean
  typeAheadOptionMatcher?: MatcherFn
  buildSelection?: (selected: any, select: Select) => any
  onChange: (selection: any, select: Select, event?: Event) => void
  search?: (term: string, select: Select) => any[] | PromiseProxy<any[]>
  onOpen?: (select: Select, e: Event) => boolean | undefined
  onClose?: (select: Select, e: Event) => boolean | undefined
  onInput?: (term: string, select: Select, e: Event) => string | false | void
  onKeydown?: (select: Select, e: KeyboardEvent) => boolean | undefined
  onFocus?: (select: Select, event: FocusEvent) => void
  onBlur?: (select: Select, event: FocusEvent) => void
  scrollTo?: (option: any, select: Select) => void
  registerAPI?: (select: Select) => void
}

const isArrayable = <T>(coll: any): coll is Arrayable<T> => {
  return typeof coll.toArray === 'function';
}

const isPromiseLike = <T>(thing: any): thing is Promise<T> => {
  return typeof thing.then === 'function';
}

const isPromiseProxyLike = <T>(thing: any): thing is PromiseProxy<T> => {
  return isPromiseLike(thing) && Object.hasOwnProperty.call(thing, 'content');
}

const isCancellablePromise = <T>(thing: any): thing is CancellablePromise<T> => {
  return typeof thing.cancel === 'function';
}

export default class PowerSelect extends Component<PowerSelectArgs> {
  // Untracked properties
  _publicAPIActions = {
    search: this._search,
    highlight: this._highlight,
    select: this._select,
    choose: this._choose,
    scrollTo: this._scrollTo
  }

  // Tracked properties
  @tracked private _resolvedOptions?: any[]
  @tracked private _resolvedSelected?: any
  @tracked private _repeatingChar = ''
  @tracked private _expirableSearchText = ''
  @tracked private _searchResult?: any[]
  @tracked isActive = false
  @tracked loading = false
  @tracked searchText = ''
  @tracked lastSearchedText = ''
  @tracked highlighted?: any
  storedAPI!: Select
  private _lastOptionsPromise?: PromiseProxy<any[]>
  private _lastSelectedPromise?: PromiseProxy<any>
  private _lastSearchPromise?: PromiseProxy<any[]> | CancellablePromise<any[]>
  private _filterResultsCache: { results: any[], options: any[], searchText: string } = { results: [], options: [], searchText: this.searchText };

  // Lifecycle hooks
  constructor(owner: unknown, args: PowerSelectArgs) {
    super(owner, args);
    assert('<PowerSelect> requires an `@onChange` function', this.args.onChange && typeof this.args.onChange === 'function');
  }

  willDestroy() {
    if (this._lastSelectedPromise && isPromiseProxyLike(this._lastSelectedPromise)) {
      try {
        removeObserver(this._lastSelectedPromise, 'content', this, this._selectedObserverCallback);
      } catch {}
      this._lastSelectedPromise = undefined;
    }
    super.willDestroy.apply(this, arguments);
  }

  // Getters
  get highlightOnHover(): boolean {
    return this.args.highlightOnHover === undefined ? true : this.args.highlightOnHover
  }

  get highlightedIndex(): string {
    let results = this.results;
    let highlighted = this.highlighted;
    return pathForOption(results, highlighted);
  }

  get searchMessage(): string {
    return this.args.searchMessage === undefined ? 'Type to search' : this.args.searchMessage;
  }

  get noMatchesMessage(): string {
    return this.args.noMatchesMessage === undefined ? 'No results found' : this.args.noMatchesMessage;
  }

  get matchTriggerWidth() {
    return this.args.matchTriggerWidth === undefined ? true : this.args.matchTriggerWidth;
  }

  get mustShowSearchMessage(): boolean {
    return !this.loading && this.searchText.length === 0
      && !!this.args.search && !!this.searchMessage
      && this.resultsCount === 0;
  }

  get mustShowNoMessages(): boolean {
    return !this.loading
      && this.resultsCount === 0
      && (!this.args.search || this.lastSearchedText.length > 0);
  }

  get results(): any[] {
    if (this.searchText.length > 0) {
      if (this.args.search) {
        return toPlainArray(this._searchResult || this.options);
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

  get options(): any[] {
    if (this._resolvedOptions) return toPlainArray(this._resolvedOptions);
    if (this.args.options) {
      return toPlainArray(this.args.options as any[]);
    } else {
      return [];
    }
  }

  get resultsCount(): number {
    return countOptions(this.results);
  }

  get selected(): any {
    if (this._resolvedSelected) {
      return toPlainArray(this._resolvedSelected);
    } else if (this.args.selected && typeof this.args.selected.then !== 'function') {
      return toPlainArray(this.args.selected);
    }
    return undefined;
  }

  // Actions
  @action
  handleOpen(_select: Select, e: Event): boolean | void {
    if (this.args.onOpen && this.args.onOpen(this.storedAPI, e) === false) {
      return false;
    }
    if (e) {
      if (e instanceof KeyboardEvent && e.type === 'keydown' && (e.keyCode === 38 || e.keyCode === 40)) {
        e.preventDefault();
      }
    }
    this._resetHighlighted();
  }

  @action
  handleClose(_select: Select, e: Event): boolean | void {
    if (this.args.onClose && this.args.onClose(this.storedAPI, e) === false) {
      return false;
    }
    this._highlight(undefined);
  }

  @action
  handleInput(e: InputEvent): void {
    if (e.target === null) return;
    let term = (e.target as HTMLInputElement).value;
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
  handleKeydown(e: KeyboardEvent) {
    if (this.args.onKeydown && this.args.onKeydown(this.storedAPI, e) === false) {
      return false;
    }
    return this._routeKeydown(this.storedAPI, e);
  }

  @action
  handleTriggerKeydown(e: KeyboardEvent) {
    if (this.args.onKeydown && this.args.onKeydown(this.storedAPI, e) === false) {
      e.stopImmediatePropagation();
      return;
    }
    if (e.ctrlKey || e.metaKey) {
      e.stopImmediatePropagation();
      return;
    }
    if ((e.keyCode >= 48 && e.keyCode <= 90) || isNumpadKeyEvent(e)) { // Keys 0-9, a-z or numpad keys
      (this.triggerTypingTask as unknown as Performable).perform(e);
    } else if (e.keyCode === 32) {  // Space
      this._handleKeySpace(this.storedAPI, e);
    } else {
      return this._routeKeydown(this.storedAPI, e);
    }
  }

  @action
  handleFocus(event: FocusEvent): void {
    if (!this.isDestroying) {
      scheduleOnce('actions', this, this._updateIsActive, true);
    }
    if (this.args.onFocus) {
      this.args.onFocus(this.storedAPI, event);
    }
  }

  @action
  handleBlur(event: FocusEvent): void {
    if (!this.isDestroying) {
      scheduleOnce('actions', this, this._updateIsActive, false);
    }
    if (this.args.onBlur) {
      this.args.onBlur(this.storedAPI, event);
    }
  }

  // Methods
  @action
  _search(term: string): void {
    if (this.searchText === term) return;
    this.searchText = term;
    if (!this.args.search) {
      this.lastSearchedText = term;
      this._resetHighlighted();
    }
  }

  @action
  _updateOptions(): void {
    if (!this.args.options) return
    if (isPromiseLike(this.args.options)) {
      if (this._lastOptionsPromise === this.args.options) return; // promise is still the same
      let currentOptionsPromise = this.args.options;
      this._lastOptionsPromise = currentOptionsPromise as PromiseProxy<any[]>;
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
  _updateHighlighted(): void {
    if (this.storedAPI.isOpen) {
      this._resetHighlighted();
    }
  }

  @action
  _updateSelected(): void {
    if (!this.args.selected) return;
    if (typeof this.args.selected.then === 'function') {
      if (this._lastSelectedPromise === this.args.selected) return; // promise is still the same
      if (this._lastSelectedPromise && isPromiseProxyLike(this._lastSelectedPromise)) {
        removeObserver(this._lastSelectedPromise, 'content', this, this._selectedObserverCallback);
      }

      let currentSelectedPromise: PromiseProxy<any> = this.args.selected;
      currentSelectedPromise.then(() => {
        if (this.isDestroyed || this.isDestroying) return;
        if (isPromiseProxyLike(currentSelectedPromise)) {
          addObserver(currentSelectedPromise, 'content', this, this._selectedObserverCallback);
        }
      });

      this._lastSelectedPromise = currentSelectedPromise;
      this._lastSelectedPromise.then(resolvedSelected => {
        if (this._lastSelectedPromise === currentSelectedPromise) {
          this._resolvedSelected = resolvedSelected;
          this._highlight(resolvedSelected)
        }
      });
    } else {
      this._resolvedSelected = undefined;
      // Don't highlight args.selected array on multi-select
      if (!Array.isArray(this.args.selected)) {
        this._highlight(this.args.selected);
      }
    }
  }

  _selectedObserverCallback(): void {
    this._resolvedSelected = this._lastSelectedPromise;
    this._highlight(this._resolvedSelected)
  }

  @action
  _highlight(opt: any): void {
    if (opt && get(opt, 'disabled')) {
      return;
    }
    this.highlighted = opt;
  }

  @action
  _select(selected: any, e?: Event): void {
    if (!isEqual(this.storedAPI.selected, selected)) {
      this.args.onChange(selected, this.storedAPI, e);
    }
  }

  @action
  _choose(selected: any, e?: Event): void {
    let selection = this.args.buildSelection ? this.args.buildSelection(selected, this.storedAPI) : selected;
    this.storedAPI.actions.select(selection, e);
    if (this.args.closeOnSelect !== false) {
      this.storedAPI.actions.close(e);
      // return false;
    }
  }

  @action
  _scrollTo(option: any): void {
    let select = this.storedAPI;
    if (!document || !option) {
      return;
    }
    if (this.args.scrollTo) {
      return this.args.scrollTo(option, select);
    }
    let optionsList = document.getElementById(`ember-power-select-options-${select.uniqueId}`) as HTMLElement;
    if (!optionsList) {
      return;
    }
    let index = indexOfOption(select.results, option);
    if (index === -1) {
      return;
    }
    let optionElement = optionsList.querySelector(`[data-option-index='${index}']`) as HTMLElement;
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
  _registerAPI(_: Element, [publicAPI]: [Select]): void {
    this.storedAPI = publicAPI;
    if (this.args.registerAPI) {
      scheduleOnce('actions', null, this.args.registerAPI, publicAPI);
    }
  }

  @action
  _performSearch(_: any, [term]: [string]): void {
    if (!this.args.search) return;
    if (term === '') {
      this.loading = false;
      this.lastSearchedText = term;
      if (this._lastSearchPromise !== undefined) {
        if (isCancellablePromise(this._lastSearchPromise)) {
          this._lastSearchPromise.cancel(); // Cancel ember-concurrency tasks
        }
        this._lastSearchPromise = undefined;
      }
      return;
    }
    let searchResult = this.args.search(term, this.storedAPI);
    if (searchResult && isPromiseLike(searchResult)) {
      this.loading = true;
      if (this._lastSearchPromise !== undefined && isCancellablePromise(this._lastSearchPromise)) {
        this._lastSearchPromise.cancel(); // Cancel ember-concurrency tasks
      }
      this._lastSearchPromise = searchResult;
      searchResult.then(results => {
        if (this._lastSearchPromise === searchResult) {
          this._searchResult = results;
          this.loading = false;
          this.lastSearchedText = term;
          scheduleOnce('actions', this, this._resetHighlighted);
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
      scheduleOnce('actions', this, this._resetHighlighted);
    }
  }

  _defaultBuildSelection(option: any): any {
    return option
  }

  _routeKeydown(select: Select, e: KeyboardEvent): boolean | void {
    if (e.keyCode === 38 || e.keyCode === 40) { // Up & Down
      return this._handleKeyUpDown(select, e);
    } else if (e.keyCode === 13) {  // ENTER
      return this._handleKeyEnter(select, e);
    } else if (e.keyCode === 9) {   // Tab
      return this._handleKeyTab(select, e);
    } else if (e.keyCode === 27) {  // ESC
      return this._handleKeyESC(select, e);
    }
  }

  _handleKeyTab(select: Select, e: KeyboardEvent): void {
    select.actions.close(e);
  }

  _handleKeyESC(select: Select, e: KeyboardEvent): void {
    select.actions.close(e);
  }

  _handleKeyEnter(select: Select, e: KeyboardEvent): boolean | void {
    if (select.isOpen && select.highlighted !== undefined) {
      select.actions.choose(select.highlighted, e);
      e.stopImmediatePropagation();
      return false;
    }
  }

  _handleKeySpace(select: Select, e: KeyboardEvent): void {
    if (e.target !== null && ['TEXTAREA', 'INPUT'].includes((e.target as Element).nodeName)) {
      e.stopImmediatePropagation();
    } else if (select.isOpen && select.highlighted !== undefined) {
      e.stopImmediatePropagation();
      e.preventDefault(); // Prevents scrolling of the page.
      select.actions.choose(select.highlighted, e);
    }
  }

  _handleKeyUpDown(select: Select, e: KeyboardEvent): void {
    if (select.isOpen) {
      e.preventDefault();
      e.stopPropagation();
      let step: 1 | -1 = e.keyCode === 40 ? 1 : -1;
      let newHighlighted = advanceSelectableOption(select.results, select.highlighted, step);
      select.actions.highlight(newHighlighted);
      select.actions.scrollTo(newHighlighted);
    } else {
      select.actions.open(e);
    }
  }

  _resetHighlighted(): void {
    let highlighted;
    let defHighlighted = this.args.defaultHighlighted || defaultHighlighted;
    if (typeof defHighlighted === 'function') {
      highlighted = defHighlighted({ results: this.results, highlighted: this.highlighted, selected: this.selected});
    } else {
      highlighted = defHighlighted
    }
    this._highlight(highlighted);
  }

  _filter(options: any[], term: string, skipDisabled = false): any[] {
    let matcher = this.args.matcher || defaultMatcher;
    let optionMatcher = getOptionMatcher(matcher, defaultMatcher, this.args.searchField);
    return filterOptions(options || [], term, optionMatcher, skipDisabled);
  }

  _updateIsActive(value: boolean) {
    this.isActive = value;
  }

  findWithOffset(options: any[], term: string, offset: number, skipDisabled = false): any {
    let typeAheadOptionMatcher = getOptionMatcher(this.args.typeAheadOptionMatcher || defaultTypeAheadMatcher, defaultTypeAheadMatcher, this.args.searchField);
    return findOptionWithOffset(options || [], term, typeAheadOptionMatcher, offset, skipDisabled);
  }

  // Tasks
  @restartableTask
  *triggerTypingTask(this: PowerSelect, e: KeyboardEvent) {
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
        this.storedAPI.actions.highlight(match);
        this.storedAPI.actions.scrollTo(match);
      } else {
        this.storedAPI.actions.select(match, e);
      }
    }
    yield timeout(1000);
    this._expirableSearchText = '';
    this._repeatingChar = '';
  }
}

function getOptionMatcher(matcher: MatcherFn, defaultMatcher: MatcherFn, searchField: string | undefined): MatcherFn {
  if (searchField && matcher === defaultMatcher) {
    return (option: any, text: string) => matcher(get(option, searchField), text);
  } else {
    return (option: any, text: string) => {
      assert('<PowerSelect> If you want the default filtering to work on options that are not plain strings, you need to provide `@searchField`', matcher !== defaultMatcher || typeof option === 'string');
      return matcher(option, text);
    };
  }
}

function isNumpadKeyEvent(e: KeyboardEvent): boolean {
  return e.keyCode >= 96 && e.keyCode <= 105;
}

const toPlainArray = <T>(collection: T[] | Arrayable<T>): T[] => {
  if (isArrayable<T>(collection)) {
    return collection.toArray();
  } else {
    return collection;
  }
}
