import Component from '@glimmer/component';
import { action } from '@ember/object';
import { precompileTemplate } from '@ember/template-compilation';
import { n } from 'decorator-transforms/runtime';
import { setComponentTemplate } from '@ember/component';

var TEMPLATE = precompileTemplate("{{#if (ember-power-select-is-selected-present @select.selected)}}\n  {{#if (or (not-eq @searchFieldPosition \'trigger\') (not @select.searchText))}}\n    {{#if @selectedItemComponent}}\n      {{#let (component (ensure-safe-component @selectedItemComponent)) as |SelectedItemComponent|}}\n        <SelectedItemComponent\n          @extra={{readonly @extra}}\n          @option={{readonly @select.selected}}\n          @select={{readonly @select}}\n        />\n      {{/let}}\n    {{else}}\n      <span class=\"ember-power-select-selected-item\">{{yield @select.selected @select}}</span>\n    {{/if}}\n  {{/if}}\n  {{#if (and @searchEnabled (eq @searchFieldPosition \'trigger\'))}}\n    <PowerSelect::Input\n      @select={{@select}}\n      @ariaActiveDescendant={{@ariaActiveDescendant}}\n      @ariaLabelledBy={{@ariaLabelledBy}}\n      @ariaDescribedBy={{@ariaDescribedBy}}\n      @role={{@role}}\n      @ariaLabel={{@ariaLabel}}\n      @listboxId={{@listboxId}}\n      @searchPlaceholder={{@placeholder}}\n      @onFocus={{@onFocus}}\n      @onBlur={{@onBlur}}\n      @onKeydown={{@onKeydown}}\n      @onInput={{@onInput}}\n      @searchFieldPosition={{@searchFieldPosition}}\n      @autofocus={{false}}\n    />\n  {{/if}}\n  {{#if (and @allowClear (not @select.disabled))}}\n    {{!-- template-lint-disable no-pointer-down-event-binding --}}\n    <span class=\"ember-power-select-clear-btn\" role=\"button\" {{on \"mousedown\" this.clear}} {{on \"touchstart\" this.clear}}>&times;</span>\n  {{/if}}\n{{else}}\n  {{#if (and @searchEnabled (eq @searchFieldPosition \'trigger\'))}}\n    {{#let\n      (component\n        \"power-select/input\"\n        select=@select\n        ariaActiveDescendant=@ariaActiveDescendant\n        ariaLabelledBy=@ariaLabelledBy\n        ariaDescribedBy=@ariaDescribedBy\n        role=@role\n        ariaLabel=@ariaLabel\n        listboxId=@listboxId\n        searchPlaceholder=@placeholder\n        onFocus=@onFocus\n        onBlur=@onBlur\n        onKeydown=@onKeydown\n        onInput=@onInput\n        searchFieldPosition=@searchFieldPosition\n        autofocus=false\n      )\n      as |InputComponent|\n    }}\n      {{#let (component (ensure-safe-component @placeholderComponent)) as |PlaceholderComponent|}}\n        <PlaceholderComponent\n          @select={{@select}}\n          @placeholder={{@placeholder}}\n          @isMultipleWithSearch={{true}}\n          @inputComponent={{InputComponent}}\n          @displayPlaceholder={{and (not @select.searchText) (not @select.selected)}}\n        />\n      {{/let}}\n    {{/let}}\n  {{else}}\n    {{#let (component (ensure-safe-component @placeholderComponent)) as |PlaceholderComponent|}}\n      <PlaceholderComponent\n        @placeholder={{@placeholder}}\n      />\n    {{/let}}\n  {{/if}}\n{{/if}}\n<span class=\"ember-power-select-status-icon\"></span>\n");

class PowerSelectTriggerComponent extends Component {
  clear(e) {
    e.stopPropagation();
    this.args.select.actions.select(null);
    if (e.type === 'touchstart') {
      return false;
    }
  }
  static {
    n(this.prototype, "clear", [action]);
  }
}
setComponentTemplate(TEMPLATE, PowerSelectTriggerComponent);

export { PowerSelectTriggerComponent as default };
//# sourceMappingURL=trigger.js.map
