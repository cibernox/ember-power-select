
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

// import { layout, tagName } from "@ember-decorators/component";
// import Component from '@ember/component';
// import { computed, action } from '@ember/object';
// import { isEqual } from '@ember/utils';
// import templateLayout from '../templates/components/power-select-multiple';
// import fallbackIfUndefined from '../utils/computed-fallback-if-undefined';

// export default @tagName('') @layout(templateLayout) class PowerSelectMultiple extends Component {
//   @fallbackIfUndefined('power-select-multiple/trigger') triggerComponent

//   @fallbackIfUndefined(null) beforeOptionsComponent

//   // CPs
//   @computed('triggerClass')
//   get concatenatedTriggerClass() {
//     let classes = ['ember-power-select-multiple-trigger'];
//     if (this.triggerClass) {
//       classes.push(this.triggerClass);
//     }
//     return classes.join(' ');
//   }

//   @computed
//   get selected() {
//     return [];
//   }
//   set selected(v) {
//     if (v === null || v === undefined) {
//       return [];
//     }
//     return v;
//   }

//   @computed('tabindex', 'searchEnabled', 'triggerComponent')
//   get computedTabIndex() {
//     if (this.triggerComponent === 'power-select-multiple/trigger' && this.args.searchEnabled) {
//       return '-1';
//     } else {
//       return this.args.tabindex || '0';
//     }
//   }

//   // Actions
//   @action
//   handleOpen(select, e) {
//     if (this.onOpen && this.onOpen(select, e) === false) {
//       return false;
//     }
//     this.focusInput(select);
//   }

//   @action
//   handleFocus(select, e) {
//     if (this.onFocus) {
//       this.onFocus(select, e);
//     }
//     this.focusInput(select);
//   }

//   @action
//   handleKeydown(select, e) {
//     if (this.onKeydown && this.onKeydown(select, e) === false) {
//       e.stopPropagation();
//       return false;
//     }
//     if (e.keyCode === 13 && select.isOpen) {
//       e.stopPropagation();
//       if (select.highlighted !== undefined) {
//         if (!select.selected || select.selected.indexOf(select.highlighted) === -1) {
//           select.actions.choose(select.highlighted, e);
//           return false;
//         } else {
//           select.actions.close(e);
//           return false;
//         }
//       } else {
//         select.actions.close(e);
//         return false;
//       }
//     }
//   }

//   // Methods
//   @fallbackIfUndefined(function(option, select) {
//     let newSelection = (select.selected || []).slice(0);
//     let idx = -1;
//     for (let i = 0; i < newSelection.length; i++) {
//       if (isEqual(newSelection[i], option)) {
//         idx = i;
//         break;
//       }
//     }
//     if (idx > -1) {
//       newSelection.splice(idx, 1);
//     } else {
//       newSelection.push(option);
//     }
//     return newSelection;
//   })
//   buildSelection

//   focusInput(select) {
//     if (select) {
//       let input = document.querySelector(`#ember-power-select-trigger-multiple-input-${select.uniqueId}`);
//       if (input) {
//         input.focus();
//       }
//     }
//   }
// }
