import Component from '@glimmer/component';
import { action } from '@ember/object';
import { isEqual } from '@ember/utils';
import type { PowerSelectArgs, PowerSelectSignature, Select } from './power-select';
import { deprecate } from '@ember/debug';
import type Owner from '@ember/owner';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface PowerSelectMultipleSignature extends PowerSelectSignature {
  // any extra property for multiple selects?
}

export default class PowerSelectMultipleComponent extends Component<PowerSelectMultipleSignature> {
  constructor(owner: Owner, args: PowerSelectArgs) {
    super(owner, args);
    deprecate(
      'You are using the `<PowerSelectMultiple>` component. Replace all usages with `<PowerSelect>` and pass `@multiple={{true}}` as a parameter to achieve the same behavior. If you have used the ID `#ember-power-select-trigger-multiple-input-{uniqueId}` to access the search field, update your `querySelector` to use `#ember-power-select-trigger-input-{uniqueId}` instead. If you have a custom multiple trigger or input component, you also need to move them to `<PowerSelect::Trigger>` / `<PowerSelect::Input>`.',
      false,
      {
        for: 'ember-power-select',
        id: 'ember-power-select.deprecate-power-select-multiple',
        since: {
          enabled: '8.10',
          available: '8.10',
        },
        until: '9.0.0',
      },
    );
  }

  get computedTabIndex() {
    if (this.args.triggerComponent === undefined && this.args.searchEnabled) {
      return '-1';
    } else {
      return this.args.tabindex || '0';
    }
  }

  // Actions
  @action
  handleOpen(select: Select, e: Event): false | void {
    if (this.args.onOpen && this.args.onOpen(select, e) === false) {
      return false;
    }
    this.focusInput(select);
  }

  @action
  handleFocus(select: Select, e: FocusEvent): void {
    if (this.args.onFocus) {
      this.args.onFocus(select, e);
    }
    this.focusInput(select);
  }

  @action
  handleKeydown(select: Select, e: KeyboardEvent): false | void {
    if (this.args.onKeydown && this.args.onKeydown(select, e) === false) {
      e.stopPropagation();
      return false;
    }
    if (e.keyCode === 13 && select.isOpen) {
      e.stopPropagation();
      if (select.highlighted !== undefined) {
        if (
          !select.selected ||
          select.selected.indexOf(select.highlighted) === -1
        ) {
          select.actions.choose(select.highlighted, e);
          return false;
        } else {
          select.actions.close(e);
          return false;
        }
      } else {
        select.actions.close(e);
        return false;
      }
    }
  }

  defaultBuildSelection(option: any, select: Select) {
    const newSelection = Array.isArray(select.selected)
      ? select.selected.slice(0)
      : [];
    let idx = -1;
    for (let i = 0; i < newSelection.length; i++) {
      if (isEqual(newSelection[i], option)) {
        idx = i;
        break;
      }
    }
    if (idx > -1) {
      newSelection.splice(idx, 1);
    } else {
      newSelection.push(option);
    }
    return newSelection;
  }

  focusInput(select: Select) {
    if (select) {
      const input = document.querySelector(
        `#ember-power-select-trigger-multiple-input-${select.uniqueId}`,
      ) as HTMLElement;
      if (input) {
        input.focus();
      }
    }
  }
}
