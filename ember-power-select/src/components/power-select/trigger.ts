import Component from '@glimmer/component';
import { action } from '@ember/object';
import type {
  Option,
  PowerSelectArgs,
  PowerSelectSelectedItemSignature,
  Select,
  TSearchFieldPosition,
} from '../power-select';
import type { ComponentLike } from '@glint/template';
import type { PowerSelectPlaceholderSignature } from './placeholder';
import PowerSelectInput, { type PowerSelectInputSignature } from './input.ts';

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
    multiple?: IsMultiple;
    buildSelection?: PowerSelectArgs<T, IsMultiple, TExtra>['buildSelection'];
    placeholderComponent?: ComponentLike<
      PowerSelectPlaceholderSignature<T, IsMultiple>
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
  get inputComponent(): ComponentLike<
    PowerSelectInputSignature<T, IsMultiple>
  > {
    return PowerSelectInput as ComponentLike<
      PowerSelectInputSignature<T, IsMultiple>
    >;
  }

  get selected() {
    return this.args.select.selected as Option<T>;
  }

  @action
  clear(e: Event): false | void {
    e.stopPropagation();
    this.args.select.actions.select(null);
    if (e.type === 'touchstart') {
      return false;
    }
  }
}
