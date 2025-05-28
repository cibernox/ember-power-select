import Component from '@glimmer/component';
import { action, get } from '@ember/object';
import { scheduleTask } from 'ember-lifeline';
import { modifier } from 'ember-modifier';
import { deprecate } from '@ember/debug';
import { precompileTemplate } from '@ember/template-compilation';
import { n } from 'decorator-transforms/runtime';
import { setComponentTemplate } from '@ember/component';

var TEMPLATE = precompileTemplate("{{! template-lint-disable no-invalid-interactive }}\n{{! template-lint-disable no-pointer-down-event-binding }}\n{{! template-lint-disable no-unsupported-role-attributes }}\n{{! template-lint-disable require-aria-activedescendant-tabindex }}\n<ul\n  id=\"ember-power-select-multiple-options-{{@select.uniqueId}}\"\n  aria-activedescendant={{if\n    (and @select.isOpen (not @searchEnabled))\n    @ariaActiveDescendant\n  }}\n  class=\"ember-power-select-multiple-options\"\n  {{this.openChange @select.isOpen}}\n  {{on \"touchstart\" this.chooseOption}}\n  {{on \"mousedown\" this.chooseOption}}\n  ...attributes\n>\n  {{#each @select.selected as |opt idx|}}\n    <li\n      class=\"ember-power-select-multiple-option\n        {{if opt.disabled \'ember-power-select-multiple-option--disabled\'}}\"\n    >\n      {{#unless @select.disabled}}\n        <span\n          role=\"button\"\n          aria-label=\"remove element\"\n          class=\"ember-power-select-multiple-remove-btn\"\n          data-selected-index={{idx}}\n        >\n          &times;\n        </span>\n      {{/unless}}\n      {{#if @selectedItemComponent}}\n        {{#let\n          (component (ensure-safe-component @selectedItemComponent))\n          as |SelectedItemComponent|\n        }}\n          <SelectedItemComponent\n            @extra={{@extra}}\n            @option={{opt}}\n            @select={{@select}}\n          />\n        {{/let}}\n      {{else}}\n        {{yield opt @select}}\n      {{/if}}\n    </li>\n  {{else}}\n    {{#if (and @placeholder (not @searchEnabled))}}\n      <li>\n        {{#let\n          (component (ensure-safe-component @placeholderComponent))\n          as |PlaceholderComponent|\n        }}\n          <PlaceholderComponent @placeholder={{@placeholder}} />\n        {{/let}}\n      </li>\n    {{/if}}\n  {{/each}}\n  {{#if (and @searchEnabled (eq @searchFieldPosition \"trigger\"))}}\n    <li class=\"ember-power-select-trigger-multiple-input-container\">\n      {{#let\n        (component\n          \"power-select-multiple/input\"\n          select=@select\n          ariaActiveDescendant=@ariaActiveDescendant\n          ariaLabelledBy=@ariaLabelledBy\n          ariaDescribedBy=@ariaDescribedBy\n          role=@role\n          ariaLabel=@ariaLabel\n          listboxId=@listboxId\n          tabindex=@tabindex\n          buildSelection=@buildSelection\n          placeholder=@placeholder\n          placeholderComponent=@placeholderComponent\n          searchField=@searchField\n          onFocus=@onFocus\n          onBlur=@onBlur\n          onKeydown=@onKeydown\n          onInput=@onInput\n        )\n        as |InputComponent|\n      }}\n        {{#let\n          (component (ensure-safe-component @placeholderComponent))\n          as |PlaceholderComponent|\n        }}\n          <PlaceholderComponent\n            @select={{@select}}\n            @placeholder={{@placeholder}}\n            @isMultipleWithSearch={{true}}\n            @inputComponent={{InputComponent}}\n            @displayPlaceholder={{and\n              (not @select.searchText)\n              (not @select.selected)\n            }}\n          />\n        {{/let}}\n      {{/let}}\n    </li>\n  {{/if}}\n</ul>\n<span class=\"ember-power-select-status-icon\"></span>");

const isIndexAccesible = target => {
  return typeof target.objectAt === 'function';
};
class TriggerComponent extends Component {
  _lastIsOpen = this.args.select.isOpen;

  // Actions
  openChanged(element, [isOpen]) {
    deprecate('You are using a power-select-multiple trigger with ember/render-modifier. Replace {{did-update this.openChanged @select.isOpen}} with {{this.openChange @select.isOpen}}.', false, {
      for: 'ember-power-select',
      id: 'ember-power-select.no-at-ember-render-modifiers',
      since: {
        enabled: '8.1',
        available: '8.1'
      },
      until: '9.0.0'
    });
    this._openChanged(element, [isOpen]);
  }
  static {
    n(this.prototype, "openChanged", [action]);
  }
  chooseOption(e) {
    if (e.target === null) return;
    const selectedIndex = e.target.getAttribute('data-selected-index');
    if (selectedIndex) {
      const numericIndex = parseInt(selectedIndex, 10);
      e.stopPropagation();
      e.preventDefault();
      const object = this.selectedObject(this.args.select.selected, numericIndex);
      this.args.select.actions.choose(object);
    }
  }
  static {
    n(this.prototype, "chooseOption", [action]);
  }
  openChange = modifier((element, [isOpen]) => {
    this._openChanged(element, [isOpen]);
  });
  _openChanged(_el, [isOpen]) {
    if (isOpen === false && this._lastIsOpen === true) {
      scheduleTask(this, 'actions', () => {
        this.args.select.actions?.search('');
      });
    }
    this._lastIsOpen = isOpen;
  }
  selectedObject(list, index) {
    if (isIndexAccesible(list)) {
      return list.objectAt(index);
    } else {
      return get(list, index);
    }
  }
}
setComponentTemplate(TEMPLATE, TriggerComponent);

export { TriggerComponent as default };
//# sourceMappingURL=trigger.js.map
