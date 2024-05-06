import Component from '@glimmer/component';
import { runTask } from 'ember-lifeline';
import { action } from '@ember/object';
import { modifier } from 'ember-modifier';
import type { Select } from '../power-select';
import { deprecate } from '@ember/debug';

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
    deprecate(
      'You are using power-select before-option component with ember/render-modifier. Replace {{will-destroy this.clearSearch}} with {{this.setupInput}}.',
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

    this.args.select.actions?.search('');
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
    deprecate(
      'You are using power-select before-option component with ember/render-modifier. Replace {{did-insert this.focusInput}} with {{this.setupInput}}.',
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

    this._focusInput(el);
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
