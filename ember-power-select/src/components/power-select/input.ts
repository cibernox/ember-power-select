import Component from '@glimmer/component';
import { runTask, scheduleTask } from 'ember-lifeline';
import { action } from '@ember/object';
import { modifier } from 'ember-modifier';
import type { Select, TSearchFieldPosition } from '../power-select';

interface PowerSelectInputSignature {
  Element: HTMLElement;
  Args: {
    select: Select;
    ariaLabel?: string;
    ariaLabelledBy?: string;
    ariaDescribedBy?: string;
    role?: string;
    searchPlaceholder?: string;
    searchFieldPosition?: TSearchFieldPosition;
    ariaActiveDescendant?: string;
    listboxId?: string;
    onKeydown: (e: KeyboardEvent) => false | void;
    onBlur: (e: FocusEvent) => void;
    onFocus: (e: FocusEvent) => void;
    onInput: (e: InputEvent) => boolean;
    autofocus?: boolean;
  };
}

export default class PowerSelectInput extends Component<PowerSelectInputSignature> {
  didSetup: boolean = false;

  private _lastIsOpen: boolean = this.args.select.isOpen;

  @action
  handleKeydown(e: KeyboardEvent): false | void {
    if (this.args.onKeydown(e) === false) {
      return false;
    }
    if (e.keyCode === 13) {
      this.args.select.actions.close(e);
    }
  }

  @action
  handleInput(event: Event): false | void {
    const e = event as InputEvent;
    if (this.args.onInput(e) === false) {
      return false;
    }
  }

  @action
  handleBlur(event: Event) {
    if (
      !this._lastIsOpen &&
      this.args.searchFieldPosition === 'trigger'
    ) {
      this.args.select.actions?.search('');
    }

    this.args.onBlur(event as FocusEvent);
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
    if (isOpen === false && this._lastIsOpen === true && document.activeElement !== element) {
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
