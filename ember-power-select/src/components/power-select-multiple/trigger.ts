import Component from '@glimmer/component';
import { action } from '@ember/object';
import { get } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import type { Select } from '../power-select';
import type { ComponentLike } from '@glint/template';

interface PowerSelectMultipleTriggerSignature {
  Element: HTMLElement;
  Args: {
    Element: HTMLElement;
    select: Select;
    searchEnabled: boolean;
    placeholder?: string;
    searchField: string;
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
    buildSelection: (lastSelection: any, select: Select) => any[];
  };
  Blocks: {
    default: [opt: any, select: Select];
  };
}

interface IndexAccesible<T> {
  objectAt(index: number): T;
}
const isIndexAccesible = <T>(target: any): target is IndexAccesible<T> => {
  return typeof target.objectAt === 'function';
};

export default class TriggerComponent extends Component<PowerSelectMultipleTriggerSignature> {
  private _lastIsOpen: boolean = this.args.select.isOpen;

  // Actions
  @action
  openChanged(_el: Element, [isOpen]: [boolean]) {
    if (isOpen === false && this._lastIsOpen === true) {
      scheduleOnce('actions', null, this.args.select.actions.search, '');
    }
    this._lastIsOpen = isOpen;
  }

  @action
  chooseOption(e: Event) {
    if (e.target === null) return;
    const selectedIndex = (e.target as Element).getAttribute(
      'data-selected-index',
    );
    if (selectedIndex) {
      const numericIndex = parseInt(selectedIndex, 10);
      e.stopPropagation();
      e.preventDefault();
      const object = this.selectedObject(
        this.args.select.selected,
        numericIndex,
      );
      this.args.select.actions.choose(object);
    }
  }

  selectedObject<T>(list: IndexAccesible<T> | T[], index: number): T {
    if (isIndexAccesible(list)) {
      return list.objectAt(index);
    } else {
      return get(list, index) as T;
    }
  }
}
