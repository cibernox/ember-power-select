
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { isEqual } from '@ember/utils';
import { PowerSelectArgs, Select } from './power-select';

interface PowerSelectMultipleArgs extends PowerSelectArgs {
 // any extra property for multiple selects?
}

export default class PowerSelectMultiple extends Component<PowerSelectMultipleArgs> {
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
        if (!select.selected || select.selected.indexOf(select.highlighted) === -1) {
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
    let newSelection = (select.selected || []).slice(0);
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
      let input = document.querySelector(`#ember-power-select-trigger-multiple-input-${select.uniqueId}`) as HTMLElement;
      if (input) {
        input.focus();
      }
    }
  }
}
