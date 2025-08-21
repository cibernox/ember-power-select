import Component from '@glimmer/component';
import { action } from '@ember/object';
import { isEqual } from '@ember/utils';
import type {
  PowerSelectArgs,
  PromiseProxy,
  Select as SingleSelect,
} from './power-select';
import type { ComponentLike } from '@glint/template';
// import type {
//   DropdownActions,
// } from 'ember-basic-dropdown/components/basic-dropdown';
import TriggerComponent from './power-select-multiple/trigger.ts';
import { ensureSafeComponent } from '@embroider/util';
import type { PowerSelectMultiplePlaceholderSignature } from './power-select-multiple/placeholder';
// import type { PowerSelectSearchMessageSignature } from './power-select/search-message';
// import type { PowerSelectNoMatchesMessageSignature } from './power-select/no-matches-message';
// import type { BasicDropdownTriggerSignature } from 'ember-basic-dropdown/components/basic-dropdown-trigger';
// import type { BasicDropdownContentSignature } from 'ember-basic-dropdown/components/basic-dropdown-content';
// import type { PowerSelectLabelSignature } from './power-select/label';
import type { PowerSelectMultipleTriggerSignature } from './power-select-multiple/trigger';
// import type { PowerSelectBeforeOptionsSignature } from './power-select/before-options';
// import type { PowerSelectOptionsSignature } from './power-select/options';
// import type { PowerSelectPowerSelectGroupSignature } from './power-select/power-select-group';
import type { Selected as SingleSelected } from './power-select';

export type Selected<T = unknown> = SingleSelected<T, true>;

export interface PowerSelectMultipleSelectedItemSignature<
  T = unknown,
  TExtra = unknown,
> {
  Element: HTMLElement;
  Args: {
    extra?: TExtra;
    selected: T;
    select: Select<T>;
  };
  Blocks: {
    default: [];
  };
}

export interface PowerSelectMultipleAfterOptionsSignature<
  T = unknown,
  TExtra = unknown,
> {
  Element: HTMLElement;
  Args: {
    extra: TExtra;
    select: Select<T>;
  };
  Blocks: {
    default: [];
  };
}

// interface SelectActions<T> extends DropdownActions {
//   search: (term: string) => void;
//   highlight: (option: T | undefined) => void;
//   select: (selected: Selected<T>, e?: Event) => void;
//   choose: (selected: T, e?: Event) => void;
//   scrollTo: (option: T | undefined) => void;
//   labelClick: (e: MouseEvent) => void;
// }

// export interface Select<T = unknown>
//   extends Omit<SingleSelect<T>, 'selected' | 'actions'> {
//   selected: Selected<T>;
//   actions: SelectActions<T>;
// }

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Select<T = unknown> extends SingleSelect<T, true>{
}

interface PowerSelectMultipleArgs<T = unknown, TExtra = unknown> extends Omit<PowerSelectArgs<T, TExtra>, 'placeholderComponent' | 'selected' | 'triggerComponent' | 'selectedItemComponent' | 'afterOptionsComponent' | 'buildSelection' | 'onChange' | 'search' | 'onOpen' | 'onClose' | 'onInput' | 'onKeydown' | 'onFocus' | 'onBlur' | 'scrollTo' | 'registerAPI'> {
  placeholderComponent?: ComponentLike<PowerSelectMultiplePlaceholderSignature<T>>;
  // searchMessageComponent?: ComponentLike<PowerSelectSearchMessageSignature<T>>;
  // noMatchesMessageComponent?: ComponentLike<PowerSelectNoMatchesMessageSignature<T>>;
  // options?: readonly T[] | Promise<readonly T[]>;
  selected?: T[] | PromiseProxy<T[]>;
  // labelComponent?: ComponentLike<PowerSelectLabelSignature<T>>;
  triggerComponent?: ComponentLike<PowerSelectMultipleTriggerSignature<T, TExtra>>;
  selectedItemComponent?: ComponentLike<PowerSelectMultipleSelectedItemSignature<T>>;
  // beforeOptionsComponent?: ComponentLike<PowerSelectBeforeOptionsSignature<T>>;
  // optionsComponent?: ComponentLike<PowerSelectOptionsSignature<T>>;
  // groupComponent?: ComponentLike<PowerSelectPowerSelectGroupSignature<T>>;
  afterOptionsComponent?: ComponentLike<PowerSelectMultipleAfterOptionsSignature<T>>;
  buildSelection?: (
    selected: Selected<T>,
    select: Select<T>,
  ) => Selected<T> | null;
  onChange: (selection: Selected<T>, select: Select<T>, event?: Event) => void;
  search?: (
    term: string,
    select: Select<T>,
  ) => readonly T[] | Promise<readonly T[]>;
  onOpen?: (select: Select<T>, e: Event | undefined) => boolean | undefined;
  onClose?: (select: Select<T>, e: Event | undefined) => boolean | undefined;
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

export interface PowerSelectMultipleSignature<T = unknown, TExtra = unknown> {
  Element: Element;
  Args: PowerSelectMultipleArgs<T, TExtra>;
  Blocks: {
    default: [option: T, select: Select<T>];
  };
}

export default class PowerSelectMultipleComponent<
  T = unknown,
  TExtra = unknown
> extends Component<PowerSelectMultipleSignature<T, TExtra>> {
  get computedTabIndex() {
    if (this.args.triggerComponent === undefined && this.args.searchEnabled) {
      return '-1';
    } else {
      return this.args.tabindex || '0';
    }
  }

  get triggerComponent(): ComponentLike<PowerSelectMultipleTriggerSignature<T, TExtra>> {
    if (this.args.triggerComponent) {
      return ensureSafeComponent(this.args.triggerComponent, this);
    }

    return TriggerComponent as unknown as ComponentLike<PowerSelectMultipleTriggerSignature<T, TExtra>>;
  }

  // Actions
  @action
  handleOpen(select: Select<T>, e: Event | undefined): boolean | void {
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
  handleKeydown(select: Select<T>, e: KeyboardEvent): boolean | void {
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
