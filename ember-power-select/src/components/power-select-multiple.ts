import Component from '@glimmer/component';
import { action } from '@ember/object';
import { isEqual } from '@ember/utils';
import type {
  PowerSelectAfterOptionsSignature,
  PowerSelectSelectedItemSignature,
  PromiseProxy,
  Select as SingleSelect,
  TLabelClickAction,
  TSearchFieldPosition,
} from './power-select';
import type { ComponentLike } from '@glint/template';
import type { DefaultHighlightedParams, MatcherFn } from '../utils/group-utils';
import type {
  DropdownActions,
  TRootEventType,
} from 'ember-basic-dropdown/components/basic-dropdown';
import type { CalculatePosition } from 'ember-basic-dropdown/utils/calculate-position';
import type { PowerSelectPlaceholderSignature } from './power-select/placeholder';
import type { PowerSelectSearchMessageSignature } from './power-select/search-message';
import type { PowerSelectNoMatchesMessageSignature } from './power-select/no-matches-message';
import type { BasicDropdownTriggerSignature } from 'ember-basic-dropdown/components/basic-dropdown-trigger';
import type { BasicDropdownContentSignature } from 'ember-basic-dropdown/components/basic-dropdown-content';
import type { PowerSelectLabelSignature } from './power-select/label';
import type { PowerSelectMultipleTriggerSignature } from './power-select-multiple/trigger';
import type { PowerSelectBeforeOptionsSignature } from './power-select/before-options';
import type { PowerSelectOptionsSignature } from './power-select/options';
import type { PowerSelectPowerSelectGroupSignature } from './power-select/power-select-group';

export type Selected<T> = T[] | null | undefined;

interface SelectActions<T> extends DropdownActions {
  search: (term: string) => void;
  highlight: (option: T | undefined) => void;
  select: (selected: T, e?: Event) => void;
  choose: (selected: T, e?: Event) => void;
  scrollTo: (option: T | undefined) => void;
  labelClick: (e: MouseEvent) => void;
}

export interface Select<T>
  extends Omit<SingleSelect<T>, 'selected' | 'actions'> {
  selected: Selected<T>;
  actions: SelectActions<T>;
}

interface PowerSelectMultipleArgs<T = unknown, TExtra = unknown> {
  highlightOnHover?: boolean;
  placeholderComponent?:
    | string
    | ComponentLike<PowerSelectPlaceholderSignature>;
  searchMessage?: string;
  searchMessageComponent?:
    | string
    | ComponentLike<PowerSelectSearchMessageSignature>;
  noMatchesMessage?: string;
  noMatchesMessageComponent?:
    | string
    | ComponentLike<PowerSelectNoMatchesMessageSignature>;
  matchTriggerWidth?: boolean;
  resultCountMessage?: (resultCount: number) => string;
  options?: readonly T[] | Promise<readonly T[]>;
  selected?: T[] | PromiseProxy<T[]>;
  destination?: string;
  destinationElement?: HTMLElement;
  closeOnSelect?: boolean;
  renderInPlace?: boolean;
  preventScroll?: boolean;
  defaultHighlighted?: (params: DefaultHighlightedParams<T>) => T | undefined;
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
  ebdTriggerComponent?: string | ComponentLike<BasicDropdownTriggerSignature>;
  ebdContentComponent?: string | ComponentLike<BasicDropdownContentSignature>;
  labelComponent?: string | ComponentLike<PowerSelectLabelSignature<T>>;
  triggerComponent?:
    | string
    | ComponentLike<PowerSelectMultipleTriggerSignature<T, TExtra>>;
  selectedItemComponent?:
    | string
    | ComponentLike<PowerSelectSelectedItemSignature<T>>;
  beforeOptionsComponent?:
    | string
    | ComponentLike<PowerSelectBeforeOptionsSignature<T>>;
  optionsComponent?: string | ComponentLike<PowerSelectOptionsSignature<T>>;
  groupComponent?:
    | string
    | ComponentLike<PowerSelectPowerSelectGroupSignature<T>>;
  afterOptionsComponent?:
    | string
    | ComponentLike<PowerSelectAfterOptionsSignature<T>>;
  extra?: TExtra;
  matcher?: MatcherFn;
  initiallyOpened?: boolean;
  typeAheadOptionMatcher?: MatcherFn;
  buildSelection?: (
    selected: Selected<T>,
    select: Select<T>,
  ) => Selected<T> | null;
  onChange: (selection: Selected<T>, select: Select<T>, event?: Event) => void;
  search?: (
    term: string,
    select: Select<T>,
  ) => readonly T[] | Promise<readonly T[]>;
  onOpen?: (select: Select<T>, e: Event) => boolean | undefined;
  onClose?: (select: Select<T>, e: Event) => boolean | undefined;
  onInput?: (
    term: string,
    select: Select<T>,
    e: Event,
  ) => string | false | void;
  onKeydown?: (select: Select<T>, e: KeyboardEvent) => boolean | undefined;
  onFocus?: (select: Select<T>, event: FocusEvent) => void;
  onBlur?: (select: Select<T>, event: FocusEvent) => void;
  scrollTo?: (option: T, select: Select<T>) => void;
  registerAPI?: (select: Select<T>) => void;
}

export interface PowerSelectMultipleSignature<T = unknown> {
  Element: HTMLElement;
  Args: PowerSelectMultipleArgs<T>;
  Blocks: {
    default: [option: T, select: Select<T>];
  };
}

export default class PowerSelectMultipleComponent<
  T = unknown,
> extends Component<PowerSelectMultipleSignature<T>> {
  get computedTabIndex() {
    if (this.args.triggerComponent === undefined && this.args.searchEnabled) {
      return '-1';
    } else {
      return this.args.tabindex || '0';
    }
  }

  // Actions
  @action
  handleOpen(select: Select<T>, e: Event): false | void {
    if (this.args.onOpen && this.args.onOpen(select, e) === false) {
      return false;
    }
    this.focusInput(select);
  }

  @action
  handleFocus(select: Select<T>, e: FocusEvent): void {
    if (this.args.onFocus) {
      this.args.onFocus(select, e);
    }
    this.focusInput(select);
  }

  @action
  handleKeydown(select: Select<T>, e: KeyboardEvent): false | void {
    if (this.args.onKeydown && this.args.onKeydown(select, e) === false) {
      e.stopPropagation();
      return false;
    }
    if (e.keyCode === 13 && select.isOpen) {
      e.stopPropagation();
      if (select.highlighted !== undefined) {
        if (
          !select.selected ||
          select.selected.indexOf(select.highlighted) === -1
        ) {
          select.actions.choose(select.highlighted, e);
          return false;
        } else {
          select.actions.close(e);
          return false;
        }
      } else {
        select.actions.close(e);
        return false;
      }
    }
  }

  defaultBuildSelection(option: T, select: Select<T>) {
    const newSelection = Array.isArray(select.selected)
      ? select.selected.slice(0)
      : [];
    let idx = -1;
    for (let i = 0; i < newSelection.length; i++) {
      if (isEqual(newSelection[i], option)) {
        idx = i;
        break;
      }
    }
    if (idx > -1) {
      newSelection.splice(idx, 1);
    } else {
      newSelection.push(option);
    }
    return newSelection;
  }

  focusInput(select: Select<T>) {
    if (select) {
      const input = document.querySelector(
        `#ember-power-select-trigger-multiple-input-${select.uniqueId}`,
      ) as HTMLElement;
      if (input) {
        input.focus();
      }
    }
  }
}
