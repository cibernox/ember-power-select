import Component from '@glimmer/component';
import { scheduleOnce, later } from '@ember/runloop';
import { action } from '@ember/object';
import { modifier } from 'ember-modifier';
import type { Select } from '../power-select';

interface PowerSelectBeforeOptionsSignature {
  Element: HTMLElement;
  Args: {
    select: Select;
    searchEnabled: boolean;
    ariaLabel?: string;
    ariaLabelledBy?: string;
    ariaDescribedBy?: string;
    role?: string;
    searchPlaceholder?: string;
    ariaActiveDescendant?: string;
    listboxId?: string;
    onKeydown: (e: KeyboardEvent) => false | void;
    onBlur: (e: FocusEvent) => void;
    onFocus: (e: FocusEvent) => void;
    onInput: (e: InputEvent) => boolean;
    autofocus?: boolean;
  };
}

export default class PowerSelectBeforeOptionsComponent extends Component<PowerSelectBeforeOptionsSignature> {
  didSetup: boolean = false;

  @action
  clearSearch(): void {
    scheduleOnce('actions', this.args.select.actions, 'search', '');
  }

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
  focusInput(el: HTMLElement) {
    later(() => {
      if (this.args.autofocus !== false) {
        el.focus();
      }
    }, 0);
  }

  setupInput = modifier(
    (el: HTMLElement) => {
      if (this.didSetup) {
        return;
      }

      this.didSetup = true;

      this.focusInput(el);

      return () => this.clearSearch();
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    { eager: false },
  );
}
