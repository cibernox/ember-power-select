import Component from '@glimmer/component';
import { runTask, scheduleTask } from 'ember-lifeline';
import { action } from '@ember/object';
import { modifier } from 'ember-modifier';
import { assert } from '@ember/debug';
import { isBlank } from '@ember/utils';
import { get } from '@ember/object';
import type { Option, Select, Selected, TSearchFieldPosition } from '../power-select';
import type { ComponentLike } from '@glint/template';
import type { PowerSelectPlaceholderSignature } from './placeholder';

export interface PowerSelectInputSignature<
  T = unknown,
  IsMultiple extends boolean = false,
> {
  Element: HTMLElement;
  Args: {
    select: Select<T, IsMultiple>;
    ariaLabel?: string;
    ariaLabelledBy?: string;
    ariaDescribedBy?: string;
    role?: string;
    searchField?: string;
    searchPlaceholder?: string;
    searchFieldPosition?: TSearchFieldPosition;
    ariaActiveDescendant?: string;
    isDefaultPlaceholder?: boolean;
    listboxId?: string;
    autofocus?: boolean;
    tabindex?: number | string;
    multiple?: IsMultiple;
    placeholderComponent?: ComponentLike<
      PowerSelectPlaceholderSignature<T, IsMultiple>
    >;
    onKeydown?: (e: KeyboardEvent) => boolean | void;
    onBlur?: (e: FocusEvent) => void;
    onFocus?: (e: FocusEvent) => void;
    onInput?: (e: InputEvent) => void | boolean;
    buildSelection?: (
      lastSelection: Option<T>,
      select: Select<T, IsMultiple>,
    ) => Selected<T, IsMultiple>;
  };
}

export default class PowerSelectInput<
  T = unknown,
  IsMultiple extends boolean = false,
> extends Component<PowerSelectInputSignature<T, IsMultiple>> {
  didSetup: boolean = false;

  private _lastIsOpen: boolean = this.args.select.isOpen;

  get placeholder() {
    if (!this.args.isDefaultPlaceholder) {
      return undefined;
    }

    if (this.args.multiple) {
      return !this.args.select.selected || (Array.isArray(this.args.select.selected) && this.args.select.selected.length === 0)
        ? this.args.searchPlaceholder || ''
        : '';
    }

    return this.args.searchPlaceholder;
  }

  @action
  handleKeydown(e: KeyboardEvent): false | void {
    if (e.target === null) return;
    if (this.args.onKeydown && this.args.onKeydown(e) === false) {
      e.stopPropagation();
      return false;
    }
    if (this.args.multiple) {
      if (e.keyCode === 8) {
        e.stopPropagation();
        if (isBlank((e.target as HTMLInputElement).value) && this.args.buildSelection) {
          const lastSelection =
            Array.isArray(this.args.select.selected) &&
            this.args.select.selected[this.args.select.selected.length - 1];
          if (lastSelection) {
            this.args.select.actions.select(
              this.args.buildSelection(lastSelection, this.args.select),
              e,
            );
            if (typeof lastSelection === 'string') {
              this.args.select.actions.search(lastSelection);
            } else {
              assert(
                '`<PowerSelect>` requires a `@searchField` when the options are not strings to remove options using backspace',
                this.args.searchField,
              );
              this.args.select.actions.search(
                (get(lastSelection, this.args.searchField) || '') as string,
              );
            }
            this.args.select.actions.open(e);
          }
        }
      } else if ((e.keyCode >= 48 && e.keyCode <= 90) || e.keyCode === 32) {
        // Keys 0-9, a-z or SPACE
        e.stopPropagation();
      }
    } else if (e.keyCode === 13) {
      this.args.select.actions.close(e);
    }
  }

  @action
  handleInput(event: Event): false | void {
    const e = event as InputEvent;
    if (this.args.onInput && this.args.onInput(e) === false) {
      return false;
    }

    this.args.select.actions.open(e);
  }

  @action
  handleBlur(event: Event) {
    if (!this._lastIsOpen && this.args.searchFieldPosition === 'trigger') {
      this.args.select.actions?.search('');
    }

    if (this.args.onBlur) {
      this.args.onBlur(event as FocusEvent);
    }
  }

  @action
  handleFocus(event: Event) {
    if (this.args.onFocus) {
      this.args.onFocus(event as FocusEvent);
    }
  }

  setupInput = modifier(
    (el: HTMLElement) => {
      if (this.didSetup) {
        return;
      }

      this.didSetup = true;

      this._focusInput(el);

      return () => {
        this.args.select.actions?.search('');
      };
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    { eager: false },
  );

  openChange = modifier((element: HTMLElement, [isOpen]: [boolean]) => {
    this._openChanged(element, [isOpen]);
  });

  private _openChanged(element: HTMLElement, [isOpen]: [boolean]) {
    if (
      isOpen === false &&
      this._lastIsOpen === true &&
      document.activeElement !== element
    ) {
      scheduleTask(this, 'actions', () => {
        this.args.select.actions?.search('');
      });
    }
    this._lastIsOpen = isOpen;
  }

  private _focusInput(el: HTMLElement) {
    runTask(
      this,
      () => {
        if (this.args.autofocus !== false) {
          el.focus();
        }
      },
      0,
    );
  }
}
