import { layout, tagName } from "@ember-decorators/component";
import Component from '@ember/component';
import { computed, action } from '@ember/object';
import { isEqual } from '@ember/utils';
import templateLayout from '../templates/components/power-select-multiple';

export default @tagName('') @layout(templateLayout) class PowerSelectMultiple extends Component {
  triggerComponent = this.triggerComponent === undefined &&  'power-select-multiple/trigger'
  beforeOptionsComponent = this.beforeOptionsComponent === undefined && null

  // CPs
  @computed('triggerClass')
  get concatenatedTriggerClass() {
    let classes = ['ember-power-select-multiple-trigger'];
    if (this.triggerClass) {
      classes.push(this.triggerClass);
    }
    return classes.join(' ');
  }

  @computed
  get selected() {
    return [];
  }
  set selected(v) {
    if (v === null || v === undefined) {
      return [];
    }
    return v;
  }

  @computed('tabindex', 'searchEnabled', 'triggerComponent')
  get computedTabIndex() {
    if (this.triggerComponent === 'power-select-multiple/trigger' && this.searchEnabled) {
      return '-1';
    } else {
      return this.tabindex || '0';
    }
  }

  // Actions
  @action
  handleOpen(select, e) {
    if (this.onOpen && this.onOpen(select, e) === false) {
      return false;
    }
    this.focusInput(select);
  }

  @action
  handleFocus(select, e) {
    if (this.onfocus) {
      this.onfocus(select, e);
    }
    this.focusInput(select);
  }

  @action
  handleKeydown(select, e) {
    if (this.onkeydown && this.onkeydown(select, e) === false) {
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

  // Methods
  buildSelection(option, select) {
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

  focusInput(select) {
    if (select) {
      let input = document.querySelector(`#ember-power-select-trigger-multiple-input-${select.uniqueId}`);
      if (input) {
        input.focus();
      }
    }
  }
}

// export default Component.extend({
//   tagName: '',
//   layout,
//   // Config
//   triggerComponent: fallbackIfUndefined('power-select-multiple/trigger'),
//   beforeOptionsComponent: fallbackIfUndefined(null),

//   // CPs
//   concatenatedTriggerClass: computed('triggerClass', function() {
//     let classes = ['ember-power-select-multiple-trigger'];
//     if (this.get('triggerClass')) {
//       classes.push(this.get('triggerClass'));
//     }
//     return classes.join(' ');
//   }),

//   selected: computed({
//     get() {
//       return [];
//     },
//     set(_, v) {
//       if (v === null || v === undefined) {
//         return [];
//       }
//       return v;
//     }
//   }),

//   computedTabIndex: computed('tabindex', 'searchEnabled', 'triggerComponent', function() {
//     if (this.get('triggerComponent') === 'power-select-multiple/trigger' && this.get('searchEnabled')) {
//       return '-1';
//     } else {
//       return this.get('tabindex') || '0';
//     }
//   }),

//   // Actions
//   actions: {
//     handleOpen(select, e) {
//       let action = this.get('onOpen');
//       if (action && action(select, e) === false) {
//         return false;
//       }
//       this.focusInput(select);
//     },

//     handleFocus(select, e) {
//       let action = this.get('onfocus');
//       if (action) {
//         action(select, e);
//       }
//       this.focusInput(select);
//     },

//     handleKeydown(select, e) {
//       let action = this.get('onkeydown');
//       if (action && action(select, e) === false) {
//         e.stopPropagation();
//         return false;
//       }
//       if (e.keyCode === 13 && select.isOpen) {
//         e.stopPropagation();
//         if (select.highlighted !== undefined) {
//           if (!select.selected || select.selected.indexOf(select.highlighted) === -1) {
//             select.actions.choose(select.highlighted, e);
//             return false;
//           } else {
//             select.actions.close(e);
//             return false;
//           }
//         } else {
//           select.actions.close(e);
//           return false;
//         }
//       }
//     },

//     buildSelection(option, select) {
//       let newSelection = (select.selected || []).slice(0);
//       let idx = -1;
//       for (let i = 0; i < newSelection.length; i++) {
//         if (isEqual(newSelection[i], option)) {
//           idx = i;
//           break;
//         }
//       }
//       if (idx > -1) {
//         newSelection.splice(idx, 1);
//       } else {
//         newSelection.push(option);
//       }
//       return newSelection;
//     }
//   },

//   // Methods
//   focusInput(select) {
//     if (select) {
//       let input = document.querySelector(`#ember-power-select-trigger-multiple-input-${select.uniqueId}`);
//       if (input) {
//         input.focus();
//       }
//     }
//   }
// });
