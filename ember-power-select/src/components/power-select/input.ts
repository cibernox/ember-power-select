import Component from '@glimmer/component';
import { action } from '@ember/object';
import { modifier } from 'ember-modifier';
import { assert, deprecate } from '@ember/debug';
import { isBlank } from '@ember/utils';
import { get } from '@ember/object';
import type { Select, TSearchFieldPosition } from '../power-select';
import { task, timeout } from 'ember-concurrency';
import type { ComponentLike } from '@glint/template';

export interface PowerSelectInputSignature {
  Element: HTMLElement;
  Args: {
    select: Select;
    ariaLabel?: string;
    ariaLabelledBy?: string;
    ariaDescribedBy?: string;
    role?: string;
    searchField?: string;
    searchPlaceholder?: string;
    placeholder?: string;
    searchFieldPosition?: TSearchFieldPosition;
    ariaActiveDescendant?: string;
    isDefaultPlaceholder?: boolean;
    listboxId?: string;
    autofocus?: boolean;
    tabindex?: number | string;
    placeholderComponent?: string | ComponentLike<any>;
    onKeydown?: (e: KeyboardEvent) => boolean | void;
    onBlur?: (e: FocusEvent) => void;
    onFocus?: (e: FocusEvent) => void;
    onInput?: (e: InputEvent) => void | boolean;
    buildSelection: (lastSelection: any, select: Select) => any[];
  };
}

export default class PowerSelectInput extends Component<PowerSelectInputSignature> {
  didSetup: boolean = false;

  private _lastIsOpen: boolean = this.args.select.isOpen;

  get placeholder() {
    if (this.args.placeholder !== undefined) {
      deprecate(
        'You are using power-select::input-field with parameter @placeholder. Replace @placeholder with @searchPlaceholder',
        false,
        {
          for: 'ember-power-select',
          id: 'ember-power-select.deprecate-input-field-placeholder-argument',
          since: {
            enabled: '8.10',
            available: '8.10',
          },
          until: '9.0.0',
        },
      );
    }

    if (!this.args.isDefaultPlaceholder) {
      return undefined;
    }

    if (this.args.select.multiple) {
      return !this.args.select.selected ||
        (Array.isArray(this.args.select.selected) &&
          this.args.select.selected.length === 0)
        ? this.args.placeholder || this.args.searchPlaceholder || ''
        : '';
    }

    return this.args.placeholder || this.args.searchPlaceholder;
  }

  @action
  handleKeydown(e: KeyboardEvent): false | void {
    if (e.target === null) return;
    if (this.args.onKeydown && this.args.onKeydown(e) === false) {
      e.stopPropagation();
      return false;
    }
    if (this.args.select.multiple) {
      if (e.keyCode === 8) {
        e.stopPropagation();
        if (
          isBlank((e.target as HTMLInputElement).value) &&
          this.args.buildSelection
        ) {
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
      Promise.resolve().then(() => {
        this.args.select.actions?.search('');
      });
    }
    this._lastIsOpen = isOpen;
  }

  private _focusInput(el: HTMLElement) {
    this.focusLaterTask.perform(el);
  }

  private focusLaterTask = task(async (el: HTMLElement) => {
    await timeout(0);
    if (this.args.autofocus !== false) {
      el.focus();
    }
  });
}
