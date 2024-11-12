import Component from '@glimmer/component';
import { action } from '@ember/object';
import { isEqual } from '@ember/utils';
import { precompileTemplate } from '@ember/template-compilation';
import { n } from 'decorator-transforms/runtime';
import { setComponentTemplate } from '@ember/component';

var TEMPLATE = precompileTemplate("<PowerSelect\n  @animationEnabled={{@animationEnabled}}\n  @triggerRole={{@triggerRole}}\n  @ariaDescribedBy={{@ariaDescribedBy}}\n  @ariaInvalid={{@ariaInvalid}}\n  @ariaLabel={{@ariaLabel}}\n  @ariaLabelledBy={{@ariaLabelledBy}}\n  @labelClass={{@labelClass}}\n  @labelText={{@labelText}}\n  @labelClickAction={{@labelClickAction}}\n  @labelComponent={{ensure-safe-component @labelComponent}}\n  @afterOptionsComponent={{ensure-safe-component @afterOptionsComponent}}\n  @allowClear={{@allowClear}}\n  @beforeOptionsComponent={{if @beforeOptionsComponent (ensure-safe-component @beforeOptionsComponent) null}}\n  @buildSelection={{or @buildSelection this.defaultBuildSelection}}\n  @calculatePosition={{@calculatePosition}}\n  @closeOnSelect={{@closeOnSelect}}\n  @defaultHighlighted={{@defaultHighlighted}}\n  @highlightOnHover={{@highlightOnHover}}\n  @typeAheadOptionMatcher={{@typeAheadOptionMatcher}}\n  @destination={{@destination}}\n  @disabled={{@disabled}}\n  @dropdownClass={{@dropdownClass}}\n  @extra={{@extra}}\n  @groupComponent={{ensure-safe-component @groupComponent}}\n  @horizontalPosition={{@horizontalPosition}}\n  @initiallyOpened={{@initiallyOpened}}\n  @loadingMessage={{@loadingMessage}}\n  @matcher={{@matcher}}\n  @matchTriggerWidth={{@matchTriggerWidth}}\n  @noMatchesMessage={{@noMatchesMessage}}\n  @noMatchesMessageComponent={{ensure-safe-component @noMatchesMessageComponent}}\n  @onBlur={{@onBlur}}\n  @onChange={{@onChange}}\n  @onClose={{@onClose}}\n  @onFocus={{this.handleFocus}}\n  @onInput={{@onInput}}\n  @onKeydown={{this.handleKeydown}}\n  @onOpen={{this.handleOpen}}\n  @options={{@options}}\n  @optionsComponent={{ensure-safe-component @optionsComponent}}\n  @placeholder={{@placeholder}}\n  @placeholderComponent={{ensure-safe-component @placeholderComponent}}\n  @preventScroll={{@preventScroll}}\n  @registerAPI={{@registerAPI}}\n  @renderInPlace={{@renderInPlace}}\n  @required={{@required}}\n  @scrollTo={{@scrollTo}}\n  @search={{@search}}\n  @searchEnabled={{@searchEnabled}}\n  @searchField={{@searchField}}\n  @searchMessage={{@searchMessage}}\n  @searchMessageComponent={{@searchMessageComponent}}\n  @searchPlaceholder={{@searchPlaceholder}}\n  @selected={{@selected}}\n  @selectedItemComponent={{ensure-safe-component @selectedItemComponent}}\n  @eventType={{@eventType}}\n  @title={{@title}}\n  @triggerClass=\"ember-power-select-multiple-trigger {{@triggerClass}}\"\n  @triggerComponent={{\n    if\n    @triggerComponent\n    (component (ensure-safe-component @triggerComponent) tabindex=@tabindex)\n    (component \"power-select-multiple/trigger\" tabindex=@tabindex)\n  }}\n  @triggerId={{@triggerId}}\n  @verticalPosition={{@verticalPosition}}\n  @tabindex={{this.computedTabIndex}}\n  @ebdTriggerComponent={{ensure-safe-component @ebdTriggerComponent}}\n  @ebdContentComponent={{ensure-safe-component @ebdContentComponent}}\n  ...attributes as |option select|>\n  {{yield option select}}\n</PowerSelect>\n");

class PowerSelectMultipleComponent extends Component {
  get computedTabIndex() {
    if (this.args.triggerComponent === undefined && this.args.searchEnabled) {
      return '-1';
    } else {
      return this.args.tabindex || '0';
    }
  }

  // Actions
  handleOpen(select, e) {
    if (this.args.onOpen && this.args.onOpen(select, e) === false) {
      return false;
    }
    this.focusInput(select);
  }
  static {
    n(this.prototype, "handleOpen", [action]);
  }
  handleFocus(select, e) {
    if (this.args.onFocus) {
      this.args.onFocus(select, e);
    }
    this.focusInput(select);
  }
  static {
    n(this.prototype, "handleFocus", [action]);
  }
  handleKeydown(select, e) {
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
  static {
    n(this.prototype, "handleKeydown", [action]);
  }
  defaultBuildSelection(option, select) {
    const newSelection = Array.isArray(select.selected) ? select.selected.slice(0) : [];
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
      const input = document.querySelector(`#ember-power-select-trigger-multiple-input-${select.uniqueId}`);
      if (input) {
        input.focus();
      }
    }
  }
}
setComponentTemplate(TEMPLATE, PowerSelectMultipleComponent);

export { PowerSelectMultipleComponent as default };
//# sourceMappingURL=power-select-multiple.js.map
