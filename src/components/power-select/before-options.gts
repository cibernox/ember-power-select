import Component from '@glimmer/component';
import { action } from '@ember/object';
import { modifier } from 'ember-modifier';
import { task, timeout } from 'ember-concurrency';
import { on } from '@ember/modifier';
import { and, eq, or } from 'ember-truth-helpers';
import type { ComponentLike } from '@glint/template';
import type { PowerSelectPlaceholderSignature } from './placeholder.gts';
import type {
  PowerSelectSelectedItemSignature,
  Select,
  TSearchFieldPosition,
} from '../../types';

export interface PowerSelectBeforeOptionsSignature<
  T = unknown,
  TExtra = unknown,
  IsMultiple extends boolean = false,
> {
  Element: HTMLDivElement;
  Args: {
    select: Select<T, IsMultiple>;
    searchEnabled?: boolean;
    ariaLabel?: string;
    ariaLabelledBy?: string;
    ariaDescribedBy?: string;
    role?: string;
    searchPlaceholder?: string;
    searchFieldPosition?: TSearchFieldPosition;
    ariaActiveDescendant?: string;
    listboxId?: string;
    placeholder?: string;
    autofocus?: boolean;
    extra?: TExtra;
    triggerRole?: string;
    onKeydown: (e: KeyboardEvent) => boolean | void;
    onBlur: (e: FocusEvent) => void;
    onFocus: (e: FocusEvent) => void;
    onInput: (e: InputEvent) => boolean | void;
    placeholderComponent?: ComponentLike<
      PowerSelectPlaceholderSignature<T, TExtra, IsMultiple>
    >;
    selectedItemComponent?: ComponentLike<
      PowerSelectSelectedItemSignature<T, TExtra, IsMultiple>
    >;
  };
}

export default class PowerSelectBeforeOptionsComponent<
  T = unknown,
  TExtra = unknown,
> extends Component<PowerSelectBeforeOptionsSignature<T, TExtra>> {
  didSetup: boolean = false;

  @action
  handleKeydown(e: KeyboardEvent): false | void {
    if (this.args.onKeydown(e) === false) {
      return false;
    }
    if (e.key === 'Enter') {
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
    void this.focusLaterTask.perform(el);
  }

  private focusLaterTask = task(async (el: HTMLElement) => {
    await timeout(0);
    if (this.args.autofocus !== false) {
      el.focus();
    }
  });

  <template>
    {{#if
      (and
        @searchEnabled
        (or
          (eq @searchFieldPosition "before-options")
          (eq @searchFieldPosition undefined)
        )
      )
    }}
      <div class="ember-power-select-search">
        {{! template-lint-disable require-input-label }}
        <input
          type="search"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck={{false}}
          class="ember-power-select-search-input"
          value={{@select.searchText}}
          role={{or @role "combobox"}}
          aria-activedescendant={{@ariaActiveDescendant}}
          aria-controls={{@listboxId}}
          aria-owns={{@listboxId}}
          aria-autocomplete="list"
          aria-haspopup="listbox"
          aria-expanded={{if @select.isOpen "true" "false"}}
          placeholder={{@searchPlaceholder}}
          aria-label={{@ariaLabel}}
          aria-labelledby={{@ariaLabelledBy}}
          aria-describedby={{@ariaDescribedBy}}
          {{on "input" this.handleInput}}
          {{on "focus" @onFocus}}
          {{on "blur" @onBlur}}
          {{on "keydown" this.handleKeydown}}
          {{this.setupInput}}
        />
      </div>
    {{/if}}
  </template>
}
