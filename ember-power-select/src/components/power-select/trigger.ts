import Component from '@glimmer/component';
import { action } from '@ember/object';
import type {
  PowerSelectSelectedItemSignature,
  Select,
  Selected,
  TSearchFieldPosition,
} from '../power-select';
import type { ComponentLike } from '@glint/template';
import type { PowerSelectPlaceholderSignature } from './placeholder';

export interface PowerSelectTriggerSignature<T = unknown, TExtra = unknown> {
  Element: HTMLElement;
  Args: {
    select: Select<T>;
    allowClear: boolean;
    searchEnabled: boolean;
    placeholder?: string;
    searchField: string;
    searchFieldPosition?: TSearchFieldPosition;
    listboxId?: string;
    tabindex?: string;
    ariaLabel?: string;
    ariaLabelledBy?: string;
    ariaDescribedBy?: string;
    role?: string;
    ariaActiveDescendant: string;
    extra?: TExtra;
    placeholderComponent?:
      | string
      | ComponentLike<PowerSelectPlaceholderSignature>;
    selectedItemComponent?:
      | string
      | ComponentLike<PowerSelectSelectedItemSignature>;
    onInput?: (e: InputEvent) => boolean;
    onKeydown?: (e: KeyboardEvent) => boolean;
    onFocus?: (e: FocusEvent) => void;
    onBlur?: (e: FocusEvent) => void;
  };
  Blocks: {
    default: [selected: Selected<T>, select: Select<T>];
  };
}

export default class PowerSelectTriggerComponent<
  T = unknown,
  TExtra = unknown,
> extends Component<PowerSelectTriggerSignature<T, TExtra>> {
  @action
  clear(e: Event): false | void {
    e.stopPropagation();
    this.args.select.actions.select(null);
    if (e.type === 'touchstart') {
      return false;
    }
  }
}
