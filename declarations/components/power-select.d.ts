import Component from '@glimmer/component';
import { type MatcherFn } from '../utils/group-utils.ts';
import type { Dropdown, DropdownActions, TRootEventType } from 'ember-basic-dropdown/components/basic-dropdown';
import type Owner from '@ember/owner';
import type { CalculatePosition } from 'ember-basic-dropdown/utils/calculate-position';
import type { ComponentLike } from '@glint/template';
interface SelectActions extends DropdownActions {
    search: (term: string) => void;
    highlight: (option: any) => void;
    select: (selected: any, e?: Event) => void;
    choose: (selected: any, e?: Event) => void;
    scrollTo: (option: any) => void;
    labelClick: (e: MouseEvent) => void;
}
export interface Select extends Dropdown {
    selected: any;
    highlighted: any;
    options: readonly any[];
    results: readonly any[];
    resultsCount: number;
    loading: boolean;
    isActive: boolean;
    searchText: string;
    lastSearchedText: string;
    actions: SelectActions;
}
interface PromiseProxy<T> extends Promise<T> {
    content: any;
}
export interface PowerSelectArgs {
    highlightOnHover?: boolean;
    placeholderComponent?: string | ComponentLike<any>;
    searchMessage?: string;
    searchMessageComponent?: string | ComponentLike<any>;
    noMatchesMessage?: string;
    noMatchesMessageComponent?: string | ComponentLike<any>;
    matchTriggerWidth?: boolean;
    resultCountMessage?: (resultCount: number) => string;
    options?: readonly any[] | Promise<readonly any[]>;
    selected?: any | PromiseProxy<any>;
    destination?: string;
    destinationElement?: HTMLElement;
    closeOnSelect?: boolean;
    renderInPlace?: boolean;
    preventScroll?: boolean;
    defaultHighlighted?: any;
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
    verticalPosition?: string;
    horizontalPosition?: string;
    triggerId?: string;
    disabled?: boolean;
    title?: string;
    triggerRole?: string;
    required?: string;
    triggerClass?: string;
    ariaInvalid?: string;
    eventType?: string;
    rootEventType?: TRootEventType;
    ariaDescribedBy?: string;
    calculatePosition?: CalculatePosition;
    ebdTriggerComponent?: string | ComponentLike<any>;
    ebdContentComponent?: string | ComponentLike<any>;
    labelComponent?: string | ComponentLike<any>;
    triggerComponent?: string | ComponentLike<any>;
    selectedItemComponent?: string | ComponentLike<any>;
    beforeOptionsComponent?: string | ComponentLike<any>;
    optionsComponent?: string | ComponentLike<any>;
    groupComponent?: string | ComponentLike<any>;
    afterOptionsComponent?: string | ComponentLike<any>;
    extra?: any;
    matcher?: MatcherFn;
    initiallyOpened?: boolean;
    typeAheadOptionMatcher?: MatcherFn;
    buildSelection?: (selected: any, select: Select) => any;
    onChange: (selection: any, select: Select, event?: Event) => void;
    search?: (term: string, select: Select) => readonly any[] | Promise<readonly any[]>;
    onOpen?: (select: Select, e: Event) => boolean | undefined;
    onClose?: (select: Select, e: Event) => boolean | undefined;
    onInput?: (term: string, select: Select, e: Event) => string | false | void;
    onKeydown?: (select: Select, e: KeyboardEvent) => boolean | undefined;
    onFocus?: (select: Select, event: FocusEvent) => void;
    onBlur?: (select: Select, event: FocusEvent) => void;
    scrollTo?: (option: any, select: Select) => void;
    registerAPI?: (select: Select) => void;
}
export type TLabelClickAction = 'focus' | 'open';
export type TSearchFieldPosition = 'before-options' | 'trigger';
export interface PowerSelectSignature {
    Element: HTMLElement;
    Args: PowerSelectArgs;
    Blocks: {
        default: [option: any, select: Select];
    };
}
export default class PowerSelectComponent extends Component<PowerSelectSignature> {
    _publicAPIActions: {
        search: (term: string) => void;
        highlight: (opt: any) => void;
        select: (selected: any, e?: Event) => void;
        choose: (selected: any, e?: Event) => void;
        scrollTo: (option: any) => void;
        labelClick: (event: MouseEvent) => true | undefined;
    };
    private _resolvedOptions?;
    private _resolvedSelected?;
    private _repeatingChar;
    private _expirableSearchText;
    private _searchResult?;
    isActive: boolean;
    loading: boolean;
    searchText: string;
    lastSearchedText: string;
    highlighted?: any;
    storedAPI: Select;
    private _uid;
    private _lastOptionsPromise?;
    private _lastSelectedPromise?;
    private _lastSearchPromise?;
    private _filterResultsCache;
    constructor(owner: Owner, args: PowerSelectArgs);
    willDestroy(): void;
    get highlightOnHover(): boolean;
    get labelClickAction(): TLabelClickAction;
    get highlightedIndex(): string;
    get searchMessage(): string;
    get noMatchesMessage(): string;
    get resultCountMessage(): string;
    get matchTriggerWidth(): boolean;
    get mustShowSearchMessage(): boolean;
    get mustShowNoMessages(): boolean;
    get results(): any[];
    get options(): any[];
    get resultsCount(): number;
    get selected(): any;
    get ariaMultiSelectable(): boolean;
    get triggerId(): string;
    get labelId(): string;
    get ariaLabelledBy(): string;
    get searchFieldPosition(): TSearchFieldPosition;
    get tabindex(): string | number;
    handleOpen(_select: Select, e: Event): boolean | void;
    handleClose(_select: Select, e: Event): boolean | void;
    handleInput(e: InputEvent): void;
    handleKeydown(e: KeyboardEvent): boolean | void;
    handleTriggerKeydown(e: KeyboardEvent): boolean | void;
    _labelClick(event: MouseEvent): true | undefined;
    handleFocus(event: FocusEvent): void;
    handleBlur(event: FocusEvent): void;
    _search(term: string): void;
    _updateOptions(): void;
    _updateHighlighted(): void;
    _updateSelected(): void;
    _selectedObserverCallback(): void;
    _highlight(opt: any): void;
    _select(selected: any, e?: Event): void;
    _choose(selected: any, e?: Event): void;
    _scrollTo(option: any): void;
    _registerAPI(triggerElement: Element, [publicAPI]: [Select]): void;
    _performSearch(triggerElement: Element, [term]: [string]): void;
    updateOptions: import("ember-modifier").FunctionBasedModifier<{
        Args: {
            Positional: unknown[];
            Named: import("ember-modifier/-private/signature").EmptyObject;
        };
        Element: Element;
    }>;
    updateSelected: import("ember-modifier").FunctionBasedModifier<{
        Args: {
            Positional: unknown[];
            Named: import("ember-modifier/-private/signature").EmptyObject;
        };
        Element: Element;
    }>;
    updateRegisterAPI: import("ember-modifier").FunctionBasedModifier<{
        Args: {
            Positional: [Select];
            Named: import("ember-modifier/-private/signature").EmptyObject;
        };
        Element: Element;
    }>;
    updatePerformSearch: import("ember-modifier").FunctionBasedModifier<{
        Args: {
            Positional: [string];
            Named: import("ember-modifier/-private/signature").EmptyObject;
        };
        Element: Element;
    }>;
    private __updateOptions;
    private __updateSelected;
    private __registerAPI;
    private __performSearch;
    _defaultBuildSelection(option: any): any;
    _routeKeydown(select: Select, e: KeyboardEvent): boolean | void;
    _handleKeyTab(select: Select, e: KeyboardEvent): void;
    _handleKeyESC(select: Select, e: KeyboardEvent): void;
    _handleKeyEnter(select: Select, e: KeyboardEvent): boolean | void;
    _handleKeySpace(select: Select, e: KeyboardEvent): void;
    _handleKeyUpDown(select: Select, e: KeyboardEvent): void;
    _resetHighlighted(): void;
    _filter(options: any[], term: string, skipDisabled?: boolean): any[];
    _updateIsActive(value: boolean): void;
    findWithOffset(options: readonly any[], term: string, offset: number, skipDisabled?: boolean): any;
    triggerTypingTask: import("ember-concurrency").TaskForAsyncTaskFunction<unknown, (e: KeyboardEvent) => Promise<void>>;
}
export {};
//# sourceMappingURL=power-select.d.ts.map