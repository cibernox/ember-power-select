import Component from '@glimmer/component';
import { runTask, scheduleTask } from 'ember-lifeline';
import { action } from '@ember/object';
import { modifier } from 'ember-modifier';
import type { Select, TSearchFieldPosition } from '../power-select';

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
    searchPlaceholder?: string;
    searchFieldPosition?: TSearchFieldPosition;
    ariaActiveDescendant?: string;
    isDefaultPlaceholder?: boolean;
    listboxId?: string;
    autofocus?: boolean;
    onKeydown?: (e: KeyboardEvent) => boolean | void;
    onBlur?: (e: FocusEvent) => void;
    onFocus?: (e: FocusEvent) => void;
    onInput?: (e: InputEvent) => void | boolean;
  };
}

export default class PowerSelectInput<
  T = unknown,
  IsMultiple extends boolean = false,
> extends Component<PowerSelectInputSignature<T, IsMultiple>> {
  didSetup: boolean = false;

  private _lastIsOpen: boolean = this.args.select.isOpen;

  @action
  handleKeydown(e: KeyboardEvent): false | void {
    if (this.args.onKeydown && this.args.onKeydown(e) === false) {
      return false;
    }
    if (e.keyCode === 13) {
      this.args.select.actions.close(e);
    }
  }

  @action
  handleInput(event: Event): false | void {
    const e = event as InputEvent;
    if (this.args.onInput && this.args.onInput(e) === false) {
      return false;
    }
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
