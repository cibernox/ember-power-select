import Component from '@glimmer/component';
import { action } from '@ember/object';
import type { Select, TSearchFieldPosition } from '../power-select';
import type { ComponentLike } from '@glint/template';

interface PowerSelectTriggerSignature {
  Element: HTMLElement;
  Args: {
    select: Select;
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
    extra?: any;
    placeholderComponent?: string | ComponentLike<any>;
    selectedItemComponent?: string | ComponentLike<any>;
    onInput?: (e: InputEvent) => boolean;
    onKeydown?: (e: KeyboardEvent) => boolean;
    onFocus?: (e: FocusEvent) => void;
    onBlur?: (e: FocusEvent) => void;
  };
  Blocks: {
    default: [selected: any, select: Select];
  };
}

export default class PowerSelectTriggerComponent extends Component<PowerSelectTriggerSignature> {
  @action
  clear(e: Event): false | void {
    e.stopPropagation();
    this.args.select.actions.select(null);
    if (e.type === 'touchstart') {
      return false;
    }
  }
}
