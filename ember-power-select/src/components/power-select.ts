import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action, get } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { addObserver, removeObserver } from '@ember/object/observers';
import { scheduleTask } from 'ember-lifeline';
import { isEqual, isNone } from '@ember/utils';
import { assert, deprecate } from '@ember/debug';
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
  type MatcherFn,
  type DefaultHighlightedParams,
  type Group,
} from '../utils/group-utils.ts';
import { restartableTask, timeout } from 'ember-concurrency';
import { modifier } from 'ember-modifier';
import type {
  BasicDropdownDefaultBlock,
  Dropdown,
  DropdownActions,
  TRootEventType,
} from 'ember-basic-dropdown/components/basic-dropdown';
import type Owner from '@ember/owner';
import type {
  CalculatePosition,
  HorizontalPosition,
  VerticalPosition,
} from 'ember-basic-dropdown/utils/calculate-position';
import { isArray } from '@ember/array';
import type { ComponentLike } from '@glint/template';
import type { PowerSelectPlaceholderSignature } from './power-select/placeholder.ts';
import type { PowerSelectSearchMessageSignature } from './power-select/search-message.ts';
import type { PowerSelectNoMatchesMessageSignature } from './power-select/no-matches-message.ts';
import type { BasicDropdownTriggerSignature } from 'ember-basic-dropdown/components/basic-dropdown-trigger';
import type { BasicDropdownContentSignature } from 'ember-basic-dropdown/components/basic-dropdown-content';
import type { PowerSelectLabelSignature } from './power-select/label.ts';
import type { PowerSelectTriggerSignature } from './power-select/trigger.ts';
import type { PowerSelectBeforeOptionsSignature } from './power-select/before-options.ts';
import type { PowerSelectOptionsSignature } from './power-select/options.ts';
import type { PowerSelectPowerSelectGroupSignature } from './power-select/power-select-group.ts';
import { ensureSafeComponent } from '@embroider/util';
import PowerSelectLabelComponent from './power-select/label.ts';
import PowerSelectTriggerComponent from './power-select/trigger.ts';
import PowerSelectPlaceholderComponent from './power-select/placeholder.ts';
import PowerSelectBeforeOptionsComponent from './power-select/before-options.ts';
import SearchMessageComponent from './power-select/search-message.ts';
import NoMatchesMessageComponent from './power-select/no-matches-message.ts';
import PowerSelectOptionsComponent from './power-select/options.ts';
import PowerSelectGroupComponent from './power-select/power-select-group.ts';

export interface PowerSelectSelectedItemSignature<
  T = unknown,
  TExtra = unknown,
  IsMultiple extends boolean = false,
> {
  Element: HTMLElement;
  Args: {
    extra?: TExtra;
    selected: Option<T>;
    select: Select<T, IsMultiple>;
  };
  Blocks: {
    default: [];
  };
}

export interface PowerSelectAfterOptionsSignature<
  T = unknown,
  TExtra = unknown,
  IsMultiple extends boolean = false,
> {
  Element: HTMLElement;
  Args: {
    extra?: TExtra;
    select: Select<T, IsMultiple>;
  };
  Blocks: {
    default: [];
  };
}

interface SelectActions<T, IsMultiple extends boolean = false>
  extends DropdownActions {
  search: (term: string) => void;
  highlight: (option: Option<T> | undefined) => void;
  select: (selected: Selected<T, IsMultiple>, e?: Event) => void;
  choose: (selected: Option<T> | undefined, e?: Event) => void;
  scrollTo: (option: Option<T> | undefined) => void;
  labelClick: (e: MouseEvent) => void;
}

export interface Select<T = unknown, IsMultiple extends boolean = false>
  extends Dropdown {
  selected: Selected<T, IsMultiple>;
  highlighted: Option<T>;
  options: readonly T[];
  results: readonly T[];
  resultsCount: number;
  loading: boolean;
  isActive: boolean;
  searchText: string;
  lastSearchedText: string;
  actions: SelectActions<T, IsMultiple>;
}

export interface PromiseProxy<T = unknown> extends Promise<T> {
  content: T;
}

interface CancellablePromise<T> extends Promise<T> {
  cancel: () => void;
}

interface Sliceable<T> {
  slice(): T[];
}

export type Option<T> = T extends readonly (infer U)[]
  ? Option<U> // unwrap array
  : T extends { groupName: string; options: infer O }
    ? Option<O> // unwrap groups recursively
    : T; // base case: string, number, or object with value/name

export type Selected<
  T,
  IsMultiple extends boolean = false,
> = IsMultiple extends true
  ? Option<T>[] | null | undefined
  : Option<T> | null | undefined;

// Some args are not listed here because they are only accessed from the template. Should I list them?
export interface PowerSelectArgs<
  T,
  IsMultiple extends boolean = false,
  TExtra = unknown,
> {
  highlightOnHover?: boolean;
  placeholderComponent?: ComponentLike<
    PowerSelectPlaceholderSignature<T, IsMultiple>
  >;
  searchMessage?: string;
  searchMessageComponent?: ComponentLike<
    PowerSelectSearchMessageSignature<T, IsMultiple>
  >;
  noMatchesMessage?: string;
  noMatchesMessageComponent?: ComponentLike<
    PowerSelectNoMatchesMessageSignature<T, IsMultiple>
  >;
  matchTriggerWidth?: boolean;
  resultCountMessage?: (resultCount: number) => string;
  options?: readonly T[] | Promise<readonly T[]>;
  selected?:
    | Selected<T, IsMultiple>
    | PromiseProxy<Selected<T, IsMultiple>>
    | Promise<Selected<T, IsMultiple>>;
  multiple?: IsMultiple;
  destination?: string;
  destinationElement?: HTMLElement;
  closeOnSelect?: boolean;
  renderInPlace?: boolean;
  preventScroll?: boolean;
  defaultHighlighted?:
    | ((params: DefaultHighlightedParams<T>) => Option<T> | undefined)
    | Option<T>
    | null
    | undefined;
  searchField?: string;
  labelClass?: string;
  labelText?: string;
  labelClickAction?: TLabelClickAction;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  loadingMessage?: string;
  placeholder?: string;
  dropdownClass?: string;
  allowClear?: boolean;
  searchEnabled?: boolean;
  animationEnabled?: boolean;
  tabindex?: number | string;
  searchPlaceholder?: string;
  searchFieldPosition?: TSearchFieldPosition;
  verticalPosition?: VerticalPosition;
  horizontalPosition?: HorizontalPosition;
  triggerId?: string;
  disabled?: boolean;
  title?: string;
  triggerRole?: string;
  required?: string;
  triggerClass?: string;
  ariaInvalid?: string;
  eventType?: BasicDropdownTriggerSignature['Args']['eventType'];
  rootEventType?: TRootEventType;
  ariaDescribedBy?: string;
  calculatePosition?: CalculatePosition;
  ebdTriggerComponent?: ComponentLike<BasicDropdownTriggerSignature>;
  ebdContentComponent?: ComponentLike<BasicDropdownContentSignature>;
  labelComponent?: ComponentLike<
    PowerSelectLabelSignature<T, TExtra, IsMultiple>
  >;
  triggerComponent?: ComponentLike<
    PowerSelectTriggerSignature<T, TExtra, IsMultiple>
  >;
  selectedItemComponent?: ComponentLike<
    PowerSelectSelectedItemSignature<T, TExtra, IsMultiple>
  >;
  beforeOptionsComponent?: ComponentLike<
    PowerSelectBeforeOptionsSignature<T, TExtra, IsMultiple>
  >;
  optionsComponent?: ComponentLike<
    PowerSelectOptionsSignature<T, TExtra, IsMultiple>
  >;
  groupComponent?: ComponentLike<
    PowerSelectPowerSelectGroupSignature<Group<Option<T>>, TExtra, IsMultiple> // Note: Group<Option<T>> should be T, but this makes an issues outside the component, check this later
  >;
  afterOptionsComponent?: ComponentLike<
    PowerSelectAfterOptionsSignature<T, TExtra, IsMultiple>
  >;
  extra?: TExtra;
  matcher?: MatcherFn<T>;
  initiallyOpened?: boolean;
  typeAheadOptionMatcher?: MatcherFn<T>;
  buildSelection?: (
    selected: Option<T>,
    select: Select<T, IsMultiple>,
  ) => Selected<T, IsMultiple> | null;
  onChange: (
    selection: Selected<T, IsMultiple>,
    select: Select<T, IsMultiple>,
    event?: Event,
  ) => void;
  search?: (
    term: string,
    select: Select<T, IsMultiple>,
  ) => readonly T[] | Promise<readonly T[]>;
  onOpen?: (
    select: Select<T, IsMultiple>,
    e: Event | undefined,
  ) => boolean | void | undefined;
  onClose?: (
    select: Select<T, IsMultiple>,
    e: Event | undefined,
  ) => boolean | undefined;
  onInput?: (
    term: string,
    select: Select<T, IsMultiple>,
    e: Event,
  ) => string | false | void;
  onKeydown?: (
    select: Select<T, IsMultiple>,
    e: KeyboardEvent,
  ) => boolean | void | undefined;
  onFocus?: (select: Select<T, IsMultiple>, event: FocusEvent) => void;
  onBlur?: (select: Select<T, IsMultiple>, event: FocusEvent) => void;
  scrollTo?: (
    option: Selected<T, IsMultiple>,
    select: Select<T, IsMultiple>,
  ) => void;
  registerAPI?: (select: Select<T, IsMultiple>) => void;
}

export type TLabelClickAction = 'focus' | 'open';
export type TSearchFieldPosition = 'before-options' | 'trigger';

export interface PowerSelectSignature<
  T,
  IsMultiple extends boolean = false,
  TExtra = undefined,
> {
  Element: Element;
  Args: PowerSelectArgs<T, IsMultiple, TExtra>;
  Blocks: {
    default: [option: Option<T>, select: Select<T, IsMultiple>];
  };
}

const isSliceable = <T>(coll: unknown): coll is Sliceable<T> => {
  return isArray(coll);
};

const isPromiseLike = <T>(thing: unknown): thing is Promise<T> => {
  return (
    typeof thing === 'object' &&
    thing !== null &&
    typeof (thing as { then?: unknown }).then === 'function'
  );
};

const isPromiseProxyLike = <T>(thing: unknown): thing is PromiseProxy<T> => {
  return isPromiseLike(thing) && Object.hasOwnProperty.call(thing, 'content');
};

const isCancellablePromise = <T>(
  thing: unknown,
): thing is CancellablePromise<T> => {
  return (
    typeof thing === 'object' &&
    thing !== null &&
    typeof (thing as { cancel?: unknown }).cancel === 'function'
  );
};

export default class PowerSelectComponent<
  T,
  IsMultiple extends boolean = false,
  TExtra = undefined,
> extends Component<PowerSelectSignature<T, IsMultiple, TExtra>> {
  // Untracked properties
  _publicAPIActions = {
    search: this._search,
    highlight: this._highlight,
    select: this._select,
    choose: this._choose,
    scrollTo: this._scrollTo,
    labelClick: this._labelClick,
  };

  // Tracked properties
  @tracked private _resolvedOptions?: T | readonly T[];
  @tracked private _resolvedSelected?: Selected<T, IsMultiple> | undefined;
  @tracked private _repeatingChar = '';
  @tracked private _expirableSearchText = '';
  @tracked private _searchResult?: readonly T[];
  @tracked isActive = false;
  @tracked loading = false;
  @tracked searchText = '';
  @tracked lastSearchedText = '';
  @tracked highlighted?: Option<T> | undefined | null;
  storedAPI!: Select<T, IsMultiple>;

  private _uid = guidFor(this);
  private _lastOptionsPromise?: Promise<readonly T[]>;
  private _lastSelectedPromise?:
    | PromiseProxy<Selected<T, IsMultiple>>
    | Promise<Selected<T, IsMultiple>>;
  private _lastSearchPromise?:
    | Promise<readonly T[]>
    | CancellablePromise<readonly T[]>;
  private _filterResultsCache: {
    results: T[];
    options: T[];
    searchText: string;
  } = { results: [], options: [], searchText: this.searchText };

  // Lifecycle hooks
  constructor(owner: Owner, args: PowerSelectArgs<T, IsMultiple, TExtra>) {
    super(owner, args);
    assert(
      '<PowerSelect> requires an `@onChange` function',
      this.args.onChange && typeof this.args.onChange === 'function',
    );
  }

  willDestroy() {
    if (
      this._lastSelectedPromise &&
      isPromiseProxyLike(this._lastSelectedPromise)
    ) {
      try {
        removeObserver(
          this._lastSelectedPromise,
          'content',
          this,
          this._selectedObserverCallback,
        );
        // eslint-disable-next-line no-empty
      } catch {}
      this._lastSelectedPromise = undefined;
    }
    super.willDestroy();
  }

  // Getters
  get highlightOnHover(): boolean {
    return this.args.highlightOnHover === undefined
      ? true
      : this.args.highlightOnHover;
  }

  get labelClickAction(): TLabelClickAction {
    return this.args.labelClickAction === undefined
      ? 'focus'
      : this.args.labelClickAction;
  }

  get highlightedIndex(): string {
    const results = this.results;
    const highlighted = this.highlighted;
    return pathForOption(results, highlighted);
  }

  get searchMessage(): string {
    return this.args.searchMessage === undefined
      ? 'Type to search'
      : this.args.searchMessage;
  }

  get noMatchesMessage(): string {
    return this.args.noMatchesMessage === undefined
      ? 'No results found'
      : this.args.noMatchesMessage;
  }

  get resultCountMessage(): string {
    if (typeof this.args.resultCountMessage === 'function') {
      return this.args.resultCountMessage(this.resultsCount);
    }

    if (this.resultsCount === 1) {
      return `${this.resultsCount} result`;
    }

    return `${this.resultsCount} results`;
  }

  get matchTriggerWidth() {
    return this.args.matchTriggerWidth === undefined
      ? true
      : this.args.matchTriggerWidth;
  }

  get mustShowSearchMessage(): boolean {
    return (
      !this.loading &&
      this.searchText.length === 0 &&
      !!this.args.search &&
      !!this.searchMessage &&
      this.resultsCount === 0
    );
  }

  get mustShowNoMessages(): boolean {
    return (
      !this.loading &&
      this.resultsCount === 0 &&
      (!this.args.search || this.lastSearchedText.length > 0)
    );
  }

  get results(): T[] {
    if (this.searchText.length > 0) {
      if (this.args.search) {
        return toPlainArray(this._searchResult || this.options) as T[];
      } else {
        if (
          this._filterResultsCache.options === this.options &&
          this._filterResultsCache.searchText === this.searchText
        ) {
          // This is an optimization to avoid filtering several times, which may be a bit expensive
          // if there are many options, if neither the options nor the searchtext have changed
          return this._filterResultsCache.results;
        }
        const results = this._filter(this.options, this.searchText);
        // eslint-disable-next-line ember/no-side-effects
        this._filterResultsCache = {
          results,
          options: this.options,
          searchText: this.searchText,
        };
        return results;
      }
    } else {
      return this.options;
    }
  }

  get options(): T[] {
    if (this._resolvedOptions) {
      return toPlainArray(this._resolvedOptions) as T[];
    }
    if (this.args.options) {
      return toPlainArray(this.args.options as T[]) as T[];
    } else {
      return [];
    }
  }

  get resultsCount(): number {
    return countOptions(this.results);
  }

  get selected(): Selected<T, IsMultiple> | undefined {
    if (this._resolvedSelected) {
      return toPlainArray(this._resolvedSelected) as Selected<T, IsMultiple>;
    } else if (
      !isNone(this.args.selected) &&
      !isPromiseLike(this.args.selected)
    ) {
      return toPlainArray(this.args.selected) as Selected<T, IsMultiple>;
    }
    return undefined;
  }

  get ariaMultiSelectable(): boolean {
    return isArray(this.args.selected);
  }

  get triggerId(): string {
    return this.args.triggerId || `${this._uid}-trigger`;
  }

  get labelId(): string {
    return `${this._uid}-label`;
  }

  get ariaLabelledBy(): string | undefined {
    if (this.args.ariaLabelledBy) {
      return this.args.ariaLabelledBy;
    }

    if (this.args.labelText || this.args.labelComponent) {
      return this.labelId;
    }
  }

  get searchFieldPosition(): TSearchFieldPosition {
    return this.args.searchFieldPosition === undefined
      ? 'before-options'
      : this.args.searchFieldPosition;
  }

  get tabindex(): string | number {
    if (
      this.args.searchEnabled &&
      this.args.tabindex === undefined &&
      this.searchFieldPosition === 'trigger'
    ) {
      return '-1';
    }

    return this.args.tabindex || '0';
  }

  get labelComponent(): ComponentLike<
    PowerSelectLabelSignature<T, TExtra, IsMultiple>
  > {
    if (this.args.labelComponent) {
      return ensureSafeComponent(this.args.labelComponent, this);
    }

    return PowerSelectLabelComponent as unknown as ComponentLike<
      PowerSelectLabelSignature<T, TExtra, IsMultiple>
    >;
  }

  get triggerComponent(): ComponentLike<
    PowerSelectTriggerSignature<T, TExtra, IsMultiple>
  > {
    if (this.args.triggerComponent) {
      return ensureSafeComponent(this.args.triggerComponent, this);
    }

    return PowerSelectTriggerComponent as unknown as ComponentLike<
      PowerSelectTriggerSignature<T, TExtra, IsMultiple>
    >;
  }

  get placeholderComponent(): ComponentLike<
    PowerSelectPlaceholderSignature<T, IsMultiple>
  > {
    if (this.args.placeholderComponent) {
      return ensureSafeComponent(this.args.placeholderComponent, this);
    }

    return PowerSelectPlaceholderComponent as unknown as ComponentLike<
      PowerSelectPlaceholderSignature<T, IsMultiple>
    >;
  }

  get beforeOptionsComponent(): ComponentLike<
    PowerSelectBeforeOptionsSignature<T, TExtra, IsMultiple>
  > {
    if (this.args.beforeOptionsComponent) {
      return ensureSafeComponent(this.args.beforeOptionsComponent, this);
    }

    return PowerSelectBeforeOptionsComponent as unknown as ComponentLike<
      PowerSelectBeforeOptionsSignature<T, TExtra, IsMultiple>
    >;
  }

  get searchMessageComponent(): ComponentLike<
    PowerSelectSearchMessageSignature<T, IsMultiple>
  > {
    if (this.args.searchMessageComponent) {
      return ensureSafeComponent(this.args.searchMessageComponent, this);
    }

    return SearchMessageComponent as unknown as ComponentLike<
      PowerSelectSearchMessageSignature<T, IsMultiple>
    >;
  }

  get noMatchesMessageComponent(): ComponentLike<
    PowerSelectNoMatchesMessageSignature<T, IsMultiple>
  > {
    if (this.args.noMatchesMessageComponent) {
      return ensureSafeComponent(this.args.noMatchesMessageComponent, this);
    }

    return NoMatchesMessageComponent as unknown as ComponentLike<
      PowerSelectNoMatchesMessageSignature<T, IsMultiple>
    >;
  }

  get optionsComponent(): ComponentLike<
    PowerSelectOptionsSignature<T, TExtra, IsMultiple>
  > {
    if (this.args.optionsComponent) {
      return ensureSafeComponent(this.args.optionsComponent, this);
    }

    return PowerSelectOptionsComponent as unknown as ComponentLike<
      PowerSelectOptionsSignature<T, TExtra, IsMultiple>
    >;
  }

  get groupComponent(): ComponentLike<
    PowerSelectPowerSelectGroupSignature<T, TExtra, IsMultiple>
  > {
    if (this.args.groupComponent) {
      return ensureSafeComponent(
        this.args.groupComponent as unknown as ComponentLike<
          PowerSelectPowerSelectGroupSignature<T, TExtra, IsMultiple>
        >,
        this,
      );
    }

    return PowerSelectGroupComponent as unknown as ComponentLike<
      PowerSelectPowerSelectGroupSignature<T, TExtra, IsMultiple>
    >;
  }

  // Actions
  @action
  handleOpen(_select: Dropdown, e: Event | undefined): boolean | void {
    if (this.args.onOpen && this.args.onOpen(this.storedAPI, e) === false) {
      return false;
    }
    if (e) {
      if (
        e instanceof KeyboardEvent &&
        e.type === 'keydown' &&
        (e.keyCode === 38 || e.keyCode === 40)
      ) {
        e.preventDefault();
      }
    }
    this._resetHighlighted();
  }

  @action
  handleClose(_select: Dropdown, e: Event | undefined): boolean | void {
    if (this.args.onClose && this.args.onClose(this.storedAPI, e) === false) {
      return false;
    }
    this._highlight(undefined);
  }

  @action
  handleInput(e: InputEvent): void {
    if (e.target === null) return;
    const term = (e.target as HTMLInputElement).value;
    let correctedTerm;
    if (this.args.onInput) {
      correctedTerm = this.args.onInput(term, this.storedAPI, e);
      if (correctedTerm === false) {
        return;
      }
    }
    this._publicAPIActions.search(
      typeof correctedTerm === 'string' ? correctedTerm : term,
    );
  }

  @action
  handleKeydown(e: KeyboardEvent): boolean | void {
    if (
      this.args.onKeydown &&
      this.args.onKeydown(this.storedAPI, e) === false
    ) {
      return false;
    }
    if (
      this.searchFieldPosition === 'trigger' &&
      !this.storedAPI.isOpen &&
      e.keyCode !== 9 && // TAB
      e.keyCode !== 13 && // ENTER
      e.keyCode !== 27 // ESC
    ) {
      this.storedAPI.actions.open(e);
    }
    return this._routeKeydown(this.storedAPI, e);
  }

  @action
  handleTriggerKeydown(e: KeyboardEvent) {
    if (
      this.args.onKeydown &&
      this.args.onKeydown(this.storedAPI, e) === false
    ) {
      e.stopImmediatePropagation();
      return;
    }
    if (e.ctrlKey || e.metaKey) {
      e.stopImmediatePropagation();
      return;
    }
    if ((e.keyCode >= 48 && e.keyCode <= 90) || isNumpadKeyEvent(e)) {
      // Keys 0-9, a-z or numpad keys
      this.triggerTypingTask.perform(e);
    } else if (e.keyCode === 32) {
      // Space
      this._handleKeySpace(this.storedAPI, e);
    } else {
      return this._routeKeydown(this.storedAPI, e);
    }
  }

  @action
  _labelClick(event: MouseEvent) {
    if (!this.storedAPI) {
      return;
    }

    // Double-click, do nothing
    if (event.detail > 1) {
      return;
    }

    if (this.labelClickAction === 'open') {
      this.storedAPI.actions.open();
      return;
    } else if (this.labelClickAction === 'focus') {
      const trigger = document.querySelector(
        `[data-ebd-id="${this.storedAPI.uniqueId}-trigger"]`,
      ) as HTMLElement;

      if (!trigger) {
        return;
      }

      trigger.focus();
    }

    return true;
  }

  @action
  handleFocus(event: FocusEvent): void {
    if (!this.isDestroying) {
      scheduleTask(this, 'actions', this._updateIsActive, true);
    }
    if (this.searchFieldPosition === 'trigger') {
      if (event.target) {
        const target = event.target as HTMLElement;
        const input = target.querySelector(
          'input[type="search"]',
        ) as HTMLInputElement | null;
        input?.focus();
      }
    }
    if (this.args.onFocus) {
      this.args.onFocus(this.storedAPI, event);
    }
  }

  @action
  handleBlur(event: FocusEvent): void {
    if (!this.isDestroying) {
      scheduleTask(this, 'actions', this._updateIsActive, false);
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
    deprecate(
      'You are using power-select with ember/render-modifier. Replace {{did-insert this._updateOptions @options}} and {{did-update this._updateOptions @options}} with {{this.updateOptions @options}}.',
      false,
      {
        for: 'ember-power-select',
        id: 'ember-power-select.no-at-ember-render-modifiers',
        since: {
          enabled: '8.1',
          available: '8.1',
        },
        until: '9.0.0',
      },
    );

    this.__updateOptions();
  }

  @action
  _updateHighlighted(): void {
    if (this.storedAPI.isOpen) {
      this._resetHighlighted();
    }
  }

  @action
  _updateSelected(): void {
    deprecate(
      'You are using power-select with ember/render-modifier. Replace {{did-insert this._updateSelected @selected}} and {{did-update this._updateSelected @selected}} with {{this.updateSelected @selected}}.',
      false,
      {
        for: 'ember-power-select',
        id: 'ember-power-select.no-at-ember-render-modifiers',
        since: {
          enabled: '8.1',
          available: '8.1',
        },
        until: '9.0.0',
      },
    );

    this.__updateSelected();
  }

  _selectedObserverCallback(): void {
    this._resolvedSelected = this._lastSelectedPromise as Selected<
      T,
      IsMultiple
    >;
    if (!Array.isArray(this._resolvedSelected)) {
      this._highlight(this._resolvedSelected as Option<T>);
    }
  }

  @action
  _highlight(opt: Option<T> | undefined | null): void {
    if (
      !isNone(opt) &&
      opt &&
      typeof opt === 'object' &&
      'disabled' in opt &&
      opt.disabled
    ) {
      return;
    }
    this.highlighted = opt;
  }

  @action
  _select(selected: Selected<T, IsMultiple>, e?: Event): void {
    if (!isEqual(this.storedAPI.selected, selected)) {
      this.args.onChange(selected, this.storedAPI, e);
    }
  }

  @action
  _choose(selected: Option<T>, e?: Event): void {
    const selection = this.args.buildSelection
      ? this.args.buildSelection(selected, this.storedAPI)
      : (selected as Selected<T, IsMultiple>); // Note: For multiple we pass always function, otherwise it would not work!
    this.storedAPI.actions.select(selection, e);
    if (this.args.closeOnSelect !== false) {
      this.storedAPI.actions.close(e);
      if (this.searchFieldPosition === 'trigger') {
        this.searchText = '';
      }
      // return false;
    }
  }

  @action
  _scrollTo(option: Selected<T, IsMultiple>): void {
    const select = this.storedAPI;
    if (!document || !option) {
      return;
    }
    if (this.args.scrollTo) {
      return this.args.scrollTo(option, select);
    }
    const optionsList = document.getElementById(
      `ember-power-select-options-${select.uniqueId}`,
    ) as HTMLElement;
    if (!optionsList) {
      return;
    }
    const index = indexOfOption(select.results, option);
    if (index === -1) {
      return;
    }
    const optionElement = optionsList.querySelector(
      `[data-option-index='${index}']`,
    ) as HTMLElement;
    if (!optionElement) {
      return;
    }
    const optionTopScroll = optionElement.offsetTop - optionsList.offsetTop;
    const optionBottomScroll = optionTopScroll + optionElement.offsetHeight;
    if (optionBottomScroll > optionsList.offsetHeight + optionsList.scrollTop) {
      optionsList.scrollTop = optionBottomScroll - optionsList.offsetHeight;
    } else if (optionTopScroll < optionsList.scrollTop) {
      optionsList.scrollTop = optionTopScroll;
    }
  }

  @action
  _registerAPI(
    triggerElement: Element,
    [publicAPI]: [Select<T, IsMultiple>],
  ): void {
    deprecate(
      'You are using power-select with ember/render-modifier. Replace {{did-insert this._registerAPI publicAPI}} and {{did-update this._registerAPI publicAPI}} with {{this.updateRegisterAPI publicAPI}}.',
      false,
      {
        for: 'ember-power-select',
        id: 'ember-power-select.no-at-ember-render-modifiers',
        since: {
          enabled: '8.1',
          available: '8.1',
        },
        until: '9.0.0',
      },
    );

    this.__registerAPI(triggerElement, [publicAPI]);
  }

  @action
  _performSearch(triggerElement: Element, [term]: [string]): void {
    deprecate(
      'You are using power-select with ember/render-modifier. Replace {{did-update this._performSearch this.searchText}} with {{this.updatePerformSearch this.searchText}}.',
      false,
      {
        for: 'ember-power-select',
        id: 'ember-power-select.no-at-ember-render-modifiers',
        since: {
          enabled: '8.1',
          available: '8.1',
        },
        until: '9.0.0',
      },
    );

    this.__performSearch(triggerElement, [term]);
  }

  updateOptions = modifier(
    () => {
      this.__updateOptions();
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    { eager: false },
  );

  updateSelected = modifier(
    () => {
      this.__updateSelected();
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    { eager: false },
  );

  updateRegisterAPI = modifier(
    (triggerElement: Element, [publicAPI]: [Select<T, IsMultiple>]) => {
      this.__registerAPI(triggerElement, [publicAPI]);
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    { eager: false },
  );

  updatePerformSearch = modifier(
    (triggerElement: Element, [term]: [string]) => {
      this.__performSearch(triggerElement, [term]);
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    { eager: false },
  );

  private __updateOptions() {
    if (!this.args.options) return;
    if (isPromiseLike(this.args.options)) {
      if (this._lastOptionsPromise === this.args.options) return; // promise is still the same
      const currentOptionsPromise = this.args.options;
      this._lastOptionsPromise = currentOptionsPromise;
      this.loading = true;
      this._lastOptionsPromise
        .then((resolvedOptions) => {
          if (this._lastOptionsPromise === currentOptionsPromise) {
            this.loading = false;
            this._resolvedOptions = resolvedOptions;
            this._resetHighlighted();
          }
        })
        .catch(() => {
          if (this._lastOptionsPromise === currentOptionsPromise) {
            this.loading = false;
          }
        });
    } else {
      scheduleTask(this, 'actions', this._resetHighlighted);
    }
  }

  private __updateSelected(): void {
    if (isNone(this.args.selected)) return;
    if (isPromiseLike(this.args.selected)) {
      if (this._lastSelectedPromise === this.args.selected) return; // promise is still the same
      if (
        this._lastSelectedPromise &&
        isPromiseProxyLike(this._lastSelectedPromise)
      ) {
        removeObserver(
          this._lastSelectedPromise,
          'content',
          this,
          this._selectedObserverCallback,
        );
      }

      const currentSelectedPromise:
        | PromiseProxy<Selected<T, IsMultiple>>
        | Promise<Selected<T, IsMultiple>> = this.args.selected;
      currentSelectedPromise.then(() => {
        if (this.isDestroyed || this.isDestroying) return;
        if (isPromiseProxyLike(currentSelectedPromise)) {
          // eslint-disable-next-line ember/no-observers
          addObserver(
            currentSelectedPromise,
            'content',
            this,
            this._selectedObserverCallback,
          );
        }
      });

      this._lastSelectedPromise = currentSelectedPromise;
      this._lastSelectedPromise.then((resolvedSelected) => {
        if (this._lastSelectedPromise === currentSelectedPromise) {
          this._resolvedSelected = resolvedSelected;
          if (!Array.isArray(resolvedSelected)) {
            this._highlight(resolvedSelected as Option<T>);
          }
        }
      });
    } else {
      this._resolvedSelected = undefined;
      // Don't highlight args.selected array on multi-select
      if (!Array.isArray(this.args.selected)) {
        this._highlight(this.args.selected as Option<T>);
      }
    }
  }

  private __registerAPI(
    _: Element,
    [publicAPI]: [Select<T, IsMultiple>],
  ): void {
    this.storedAPI = publicAPI;
    if (this.args.registerAPI) {
      scheduleTask(this, 'actions', this.args.registerAPI, publicAPI);
    }
  }

  private __performSearch(_: Element, [term]: [string]): void {
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
    const searchResult = this.args.search(term, this.storedAPI);
    if (searchResult && isPromiseLike(searchResult)) {
      this.loading = true;
      if (
        this._lastSearchPromise !== undefined &&
        isCancellablePromise(this._lastSearchPromise)
      ) {
        this._lastSearchPromise.cancel(); // Cancel ember-concurrency tasks
      }
      this._lastSearchPromise = searchResult;
      searchResult
        .then((results) => {
          if (this._lastSearchPromise === searchResult) {
            this._searchResult = results;
            this.loading = false;
            this.lastSearchedText = term;
            scheduleTask(this, 'actions', this._resetHighlighted);
          }
        })
        .catch(() => {
          if (this._lastSearchPromise === searchResult) {
            this.loading = false;
            this.lastSearchedText = term;
          }
        });
    } else {
      this.lastSearchedText = term;
      this._searchResult = searchResult;
      scheduleTask(this, 'actions', this._resetHighlighted);
    }
  }

  _routeKeydown(
    select: Select<T, IsMultiple>,
    e: KeyboardEvent,
  ): boolean | void {
    if (e.keyCode === 38 || e.keyCode === 40) {
      // Up & Down
      return this._handleKeyUpDown(select, e);
    } else if (e.keyCode === 13) {
      // ENTER
      return this._handleKeyEnter(select, e);
    } else if (e.keyCode === 9) {
      // Tab
      return this._handleKeyTab(select, e);
    } else if (e.keyCode === 27) {
      // ESC
      return this._handleKeyESC(select, e);
    }
  }

  _handleKeyTab(select: Select<T, IsMultiple>, e: KeyboardEvent): void {
    select.actions.close(e);
  }

  _handleKeyESC(select: Select<T, IsMultiple>, e: KeyboardEvent): void {
    select.actions.close(e);
  }

  _handleKeyEnter(
    select: Select<T, IsMultiple>,
    e: KeyboardEvent,
  ): boolean | void {
    if (select.isOpen && select.highlighted !== undefined) {
      select.actions.choose(select.highlighted, e);
      e.stopImmediatePropagation();
      return false;
    }
  }

  _handleKeySpace(select: Select<T, IsMultiple>, e: KeyboardEvent): void {
    if (
      e.target !== null &&
      ['TEXTAREA', 'INPUT'].includes((e.target as Element).nodeName)
    ) {
      e.stopImmediatePropagation();
    } else if (select.isOpen && select.highlighted !== undefined) {
      e.stopImmediatePropagation();
      e.preventDefault(); // Prevents scrolling of the page.
      select.actions.choose(select.highlighted, e);
    }
  }

  _handleKeyUpDown(select: Select<T, IsMultiple>, e: KeyboardEvent): void {
    if (select.isOpen) {
      e.preventDefault();
      e.stopPropagation();
      const step: 1 | -1 = e.keyCode === 40 ? 1 : -1;
      const newHighlighted = advanceSelectableOption(
        select.results,
        select.highlighted,
        step,
      );
      select.actions.highlight(newHighlighted);
      select.actions.scrollTo(newHighlighted);
    } else {
      select.actions.open(e);
    }
  }

  _resetHighlighted(): void {
    let highlighted: Option<T> | null | undefined;
    const defHighlighted = this.args.defaultHighlighted || defaultHighlighted;
    if (typeof defHighlighted === 'function') {
      highlighted = (defHighlighted as typeof defaultHighlighted)({
        results: this.results,
        highlighted: this.highlighted,
        selected: this.selected,
      });
    } else {
      highlighted = defHighlighted;
    }
    this._highlight(highlighted);
  }

  _filter(options: T[], term: string, skipDisabled = false): T[] {
    const matcher = this.args.matcher || defaultMatcher;
    const optionMatcher = getOptionMatcher(
      matcher as MatcherFn<T>,
      defaultMatcher as MatcherFn<T>,
      this.args.searchField,
    );
    return filterOptions(options || [], term, optionMatcher, skipDisabled);
  }

  _updateIsActive(value: boolean) {
    this.isActive = value;
  }

  findWithOffset(
    options: readonly T[],
    term: string,
    offset: number,
    skipDisabled = false,
  ): Option<T> | undefined {
    const typeAheadOptionMatcher = getOptionMatcher(
      this.args.typeAheadOptionMatcher ||
        (defaultTypeAheadMatcher as MatcherFn<T>),
      defaultTypeAheadMatcher as MatcherFn<T>,
      this.args.searchField,
    );
    return findOptionWithOffset(
      options || [],
      term,
      typeAheadOptionMatcher,
      offset,
      skipDisabled,
    );
  }

  publicAPI = (dropdown: BasicDropdownDefaultBlock): Select<T, IsMultiple> => {
    return Object.assign({}, dropdown, {
      selected: this.selected,
      highlighted: this.highlighted,
      options: this.options,
      results: this.results,
      resultsCount: this.resultsCount,
      loading: this.loading,
      isActive: this.isActive,
      searchText: this.searchText,
      lastSearchedText: this.lastSearchedText,
      actions: Object.assign({}, dropdown.actions, this._publicAPIActions),
    }) as Select<T, IsMultiple>;
  };

  // Tasks
  triggerTypingTask = restartableTask(async (e: KeyboardEvent) => {
    // In general, a user doing this interaction means to have a different result.
    let searchStartOffset = 1;
    let repeatingChar = this._repeatingChar;
    let charCode = e.keyCode;
    if (isNumpadKeyEvent(e)) {
      charCode -= 48; // Adjust char code offset for Numpad key codes. Check here for numapd key code behavior: https://goo.gl/Qwc9u4
    }
    let term;

    // Check if user intends to cycle through results. _repeatingChar can only be the first character.
    const c = String.fromCharCode(charCode);
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
      searchStartOffset += indexOfOption(
        this.storedAPI.options,
        this.storedAPI.highlighted,
      );
    } else if (!this.storedAPI.isOpen && !isNone(this.selected)) {
      searchStartOffset += indexOfOption(this.storedAPI.options, this.selected);
    } else {
      searchStartOffset = 0;
    }

    // The char is always appended. That way, searching for words like "Aaron" will work even
    // if "Aa" would cycle through the results.
    this._expirableSearchText = this._expirableSearchText + c;
    this._repeatingChar = repeatingChar;
    const match = this.findWithOffset(
      this.storedAPI.options,
      term,
      searchStartOffset,
      true,
    );
    if (match !== undefined) {
      if (this.storedAPI.isOpen) {
        this.storedAPI.actions.highlight(match);
        this.storedAPI.actions.scrollTo(match);
      } else {
        this.storedAPI.actions.select(match as Selected<T, IsMultiple>, e);
      }
    }
    await timeout(1000);
    this._expirableSearchText = '';
    this._repeatingChar = '';
  });
}

function getOptionMatcher<T>(
  matcher: MatcherFn<T>,
  defaultMatcher: MatcherFn<T>,
  searchField: string | undefined,
): MatcherFn<T> {
  if (searchField && matcher === defaultMatcher) {
    return (option: T | undefined, text: string) =>
      matcher(get(option, searchField) as T, text);
  } else {
    return (option: T | undefined, text: string) => {
      assert(
        '<PowerSelect> If you want the default filtering to work on options that are not plain strings, you need to provide `@searchField`',
        matcher !== defaultMatcher || typeof option === 'string',
      );
      return matcher(option, text);
    };
  }
}

function isNumpadKeyEvent(e: KeyboardEvent): boolean {
  return e.keyCode >= 96 && e.keyCode <= 105;
}

const toPlainArray = <T>(collection: T | T[] | Sliceable<T>): T[] | T => {
  if (isSliceable<T>(collection)) {
    return collection.slice();
  } else {
    return collection;
  }
};
