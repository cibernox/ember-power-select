import Component from '@glimmer/component';
import { action } from '@ember/object';
import type { PowerSelectArgs } from '../power-select.gts';
import { get } from '@ember/object';
import { modifier } from 'ember-modifier';
import { deprecate } from '@ember/debug';
import PowerSelectInput, { type PowerSelectInputSignature } from './input.ts';
import type { ComponentLike } from '@glint/template';
import type { PowerSelectPlaceholderSignature } from './placeholder.gts';
import type {
  Option,
  PowerSelectSelectedItemSignature,
  Select,
  Selected,
  TSearchFieldPosition,
} from '../../types.ts';

export interface PowerSelectTriggerSignature<
  T = unknown,
  TExtra = unknown,
  IsMultiple extends boolean = false,
> {
  Element: HTMLElement;
  Args: {
    select: Select<T, IsMultiple>;
    allowClear?: boolean;
    searchEnabled?: boolean;
    placeholder?: string;
    searchPlaceholder?: string;
    searchField?: string;
    searchFieldPosition?: TSearchFieldPosition;
    listboxId?: string;
    tabindex?: number | string;
    ariaLabel?: string;
    ariaLabelledBy?: string;
    ariaDescribedBy?: string;
    loadingMessage?: string;
    role?: string;
    ariaActiveDescendant: string;
    extra?: TExtra;
    buildSelection?: PowerSelectArgs<T, IsMultiple, TExtra>['buildSelection'];
    placeholderComponent?: ComponentLike<
      PowerSelectPlaceholderSignature<T, TExtra, IsMultiple>
    >;
    selectedItemComponent?: ComponentLike<
      PowerSelectSelectedItemSignature<T, TExtra, IsMultiple>
    >;
    onInput?: (e: InputEvent) => void | boolean;
    onKeydown?: (e: KeyboardEvent) => void | boolean;
    onFocus?: (e: FocusEvent) => void;
    onBlur?: (e: FocusEvent) => void;
  };
  Blocks: {
    default: [selected: Option<T>, select: Select<T, IsMultiple>];
  };
}

export default class PowerSelectTriggerComponent<
  T = unknown,
  TExtra = unknown,
  IsMultiple extends boolean = false,
> extends Component<PowerSelectTriggerSignature<T, TExtra, IsMultiple>> {
  private _lastIsOpen: boolean = this.args.select.isOpen;

  get inputComponent(): ComponentLike<
    PowerSelectInputSignature<T, TExtra, IsMultiple>
  > {
    return PowerSelectInput as ComponentLike<
      PowerSelectInputSignature<T, TExtra, IsMultiple>
    >;
  }

  get selected() {
    return this.args.select.selected as Selected<T, false>;
  }

  get selectedMultiple() {
    return this.args.select.selected as Selected<T, true>;
  }

  @action
  clear(e: Event): false | void {
    e.stopPropagation();
    const value = this.args.select.multiple ? [] : undefined;
    this.args.select.actions.select(value as Selected<T, IsMultiple>);
    if (e.type === 'touchstart') {
      return false;
    }
  }

  isOptionDisabled(option: Option<T>): boolean {
    if (option && typeof option === 'object' && 'disabled' in option) {
      return option.disabled as boolean;
    }

    return false;
  }

  // Actions
  @action
  openChanged(element: Element, [isOpen]: [boolean]) {
    deprecate(
      'You are using a power-select-multiple trigger with ember/render-modifier. Replace {{did-update this.openChanged @select.isOpen}} with {{this.openChange @select.isOpen}}.',
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

    this._openChanged(element, [isOpen]);
  }

  @action
  chooseOption(e: Event) {
    if (!this.args.select.multiple) {
      return;
    }

    if (e.target === null) return;
    const selectedIndex = (e.target as Element).getAttribute(
      'data-selected-index',
    );
    if (selectedIndex) {
      const numericIndex = parseInt(selectedIndex, 10);
      e.stopPropagation();
      e.preventDefault();
      const object = this.selectedObject(this.selectedMultiple, numericIndex);
      this.args.select.actions.choose(object);
    }
  }

  openChange = modifier((element: Element, [isOpen]: [boolean]) => {
    this._openChanged(element, [isOpen]);
  });

  private _openChanged(_el: Element, [isOpen]: [boolean]) {
    if (isOpen === false && this._lastIsOpen === true) {
      Promise.resolve().then(() => {
        this.args.select.actions?.search('');
      });
    }
    this._lastIsOpen = isOpen;
  }

  selectedObject<T>(
    list: readonly Option<T>[] | undefined,
    index: number,
  ): Option<T> | undefined {
    if (list && 'objectAt' in list && typeof list.objectAt === 'function') {
      return list.objectAt(index);
    } else if (list) {
      return get(list, index);
    }
  }
}
