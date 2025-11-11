import Component from '@glimmer/component';
import { action } from '@ember/object';
import { get } from '@ember/object';
import { modifier } from 'ember-modifier';
import { deprecate } from '@ember/debug';
import type { Select, TSearchFieldPosition } from '../power-select';
import type { ComponentLike } from '@glint/template';
import { emberPowerSelectIsSelectedPresent } from '../../helpers/ember-power-select-is-selected-present.ts';

interface IndexAccesible<T> {
  objectAt(index: number): T;
}

const isIndexAccesible = <T>(target: any): target is IndexAccesible<T> => {
  return typeof target.objectAt === 'function';
};

interface PowerSelectTriggerSignature {
  Element: HTMLElement;
  Args: {
    select: Select;
    allowClear: boolean;
    searchEnabled: boolean;
    placeholder?: string;
    searchPlaceholder?: string;
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
    buildSelection: (lastSelection: any, select: Select) => any[];
  };
  Blocks: {
    default: [selected: any, select: Select];
  };
}

export default class PowerSelectTriggerComponent extends Component<PowerSelectTriggerSignature> {
  isSelectedPresent = emberPowerSelectIsSelectedPresent;
  private _lastIsOpen: boolean = this.args.select.isOpen;

  @action
  clear(e: Event): false | void {
    e.stopPropagation();
    this.args.select.actions.select(null);
    if (e.type === 'touchstart') {
      return false;
    }
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

  selectedObject<T>(list: IndexAccesible<T> | T[], index: number): T {
    if (isIndexAccesible(list)) {
      return list.objectAt(index);
    } else {
      return get(list, index) as T;
    }
  }
}
