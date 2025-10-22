import Component from '@glimmer/component';
import { action } from '@ember/object';
import { modifier } from 'ember-modifier';
import { deprecate } from '@ember/debug';
import { precompileTemplate } from '@ember/template-compilation';
import { n } from 'decorator-transforms/runtime';
import { setComponentTemplate } from '@ember/component';

var TEMPLATE = precompileTemplate("{{! template-lint-disable require-context-role }}\n<ul {{this.setupHandlers}} ...attributes>\n  {{#if @select.loading}}\n    {{#if @loadingMessage}}\n      <li\n        class=\"ember-power-select-option ember-power-select-option--loading-message\"\n        role=\"option\"\n        aria-selected={{false}}\n      >{{@loadingMessage}}</li>\n    {{/if}}\n  {{/if}}\n  {{#let\n    (component (ensure-safe-component @groupComponent))\n    (component (ensure-safe-component @optionsComponent))\n    as |Group Options|\n  }}\n    {{#each @options as |opt index|}}\n      {{#if (ember-power-select-is-group opt)}}\n        <Group @group={{opt}} @select={{@select}} @extra={{@extra}}>\n          <Options\n            @options={{opt.options}}\n            @select={{@select}}\n            @groupIndex=\"{{@groupIndex}}{{index}}.\"\n            @optionsComponent={{@optionsComponent}}\n            @groupComponent={{@groupComponent}}\n            @extra={{@extra}}\n            role=\"presentation\"\n            data-optgroup=\"true\"\n            class=\"ember-power-select-options\"\n            as |option|\n          >\n            {{yield option @select}}\n          </Options>\n        </Group>\n      {{else}}\n        <li\n          class=\"ember-power-select-option\"\n          id=\"{{@select.uniqueId}}-{{@groupIndex}}{{index}}\"\n          aria-selected=\"{{ember-power-select-is-equal opt @select.selected}}\"\n          aria-disabled={{if opt.disabled \"true\"}}\n          aria-current=\"{{ember-power-select-is-equal opt @select.highlighted}}\"\n          data-option-index=\"{{@groupIndex}}{{index}}\"\n          role=\"option\"\n        >\n          {{yield opt @select}}\n        </li>\n      {{/if}}\n    {{/each}}\n  {{/let}}\n</ul>");

const isTouchDevice = !!window && 'ontouchstart' in window;
if (typeof FastBoot === 'undefined') {
  (function (ElementProto) {
    if (typeof ElementProto.matches !== 'function') {
      ElementProto.matches = ElementProto.msMatchesSelector || ElementProto.mozMatchesSelector || ElementProto.webkitMatchesSelector;
    }
    if (typeof ElementProto.closest !== 'function') {
      ElementProto.closest = function closest(selector) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let element = this;
        while (element !== null && element.nodeType === 1) {
          if (element.matches(selector)) {
            return element;
          }
          element = element.parentNode;
        }
        return null;
      };
    }
  })(window.Element.prototype);
}
class PowerSelectOptionsComponent extends Component {
  isTouchDevice = this.args.extra?._isTouchDevice || isTouchDevice;
  touchMoveEvent;
  mouseOverHandler = _ => {};
  mouseUpHandler = _ => {};
  touchEndHandler = _ => {};
  touchMoveHandler = _ => {};
  touchStartHandler = _ => {};
  _listElement = null;
  _didHandlerSetup = false;
  willDestroy() {
    super.willDestroy();
    if (this._listElement) {
      this._removeHandlers(this._listElement);
    }
  }
  addHandlers(element) {
    deprecate('You are using power-select options component with ember/render-modifier. Replace {{did-insert this.addHandlers}} with {{this.setupHandlers}}.', false, {
      for: 'ember-power-select',
      id: 'ember-power-select.no-at-ember-render-modifiers',
      since: {
        enabled: '8.1',
        available: '8.1'
      },
      until: '9.0.0'
    });
    this._addHandlers(element);
  }
  static {
    n(this.prototype, "addHandlers", [action]);
  }
  removeHandlers(element) {
    deprecate('You are using power-select options component with ember/render-modifier. Replace {{will-destroy this.removeHandlers}} with {{this.setupHandlers}}.', false, {
      for: 'ember-power-select',
      id: 'ember-power-select.no-at-ember-render-modifiers',
      since: {
        enabled: '8.1',
        available: '8.1'
      },
      until: '9.0.0'
    });
    this._removeHandlers(element);
  }
  static {
    n(this.prototype, "removeHandlers", [action]);
  }
  setupHandlers = modifier(element => {
    if (this._didHandlerSetup) {
      return;
    }
    this._didHandlerSetup = true;
    this._listElement = element;
    this._addHandlers(element);
  });
  _optionFromIndex(index) {
    const parts = index.split('.');
    let option = this.args.options[parseInt(parts[0] ?? '', 10)];
    for (let i = 1; i < parts.length; i++) {
      option = option.options[parseInt(parts[i] ?? '', 10)];
    }
    return option;
  }
  _hasMoved(endEvent) {
    const moveEvent = this.touchMoveEvent;
    if (!moveEvent) {
      return false;
    }
    if (!moveEvent.changedTouches) {
      return false;
    }
    if (!endEvent.changedTouches?.[0] || moveEvent.changedTouches[0].touchType !== 'stylus') {
      return true;
    }
    const changedTouch = moveEvent.changedTouches[0];

    // Distinguish stylus scroll and tap: if touch "distance" < 5px, we consider it a tap
    const horizontalDistance = Math.abs((changedTouch?.pageX ?? 0) - endEvent.changedTouches[0].pageX);
    const verticalDistance = Math.abs((changedTouch?.pageY ?? 0) - endEvent.changedTouches[0].pageY);
    return horizontalDistance >= 5 || verticalDistance >= 5;
  }
  _addHandlers(element) {
    const isGroup = element.getAttribute('data-optgroup') === 'true';
    if (isGroup) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    const findOptionAndPerform = (action, e) => {
      if (e.target === null) return;
      const optionItem = e.target.closest('[data-option-index]');
      if (!optionItem) {
        return;
      }
      if (optionItem.closest('[aria-disabled=true]')) {
        return; // Abort if the item or an ancestor is disabled
      }
      const optionIndex = optionItem.getAttribute('data-option-index');
      if (optionIndex === null) return;
      action(this._optionFromIndex(optionIndex), e);
    };
    this.mouseUpHandler = e => findOptionAndPerform(this.args.select.actions.choose, e);
    element.addEventListener('mouseup', this.mouseUpHandler);
    if (this.args.highlightOnHover) {
      this.mouseOverHandler = e => findOptionAndPerform(this.args.select.actions.highlight, e);
      element.addEventListener('mouseover', this.mouseOverHandler);
    }
    if (this.isTouchDevice) {
      this.touchMoveHandler = e => {
        this.touchMoveEvent = e;
        if (element) {
          element.removeEventListener('touchmove', this.touchMoveHandler);
        }
      };
      // Add touch event handlers to detect taps
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      this.touchStartHandler = _ => {
        element.addEventListener('touchmove', this.touchMoveHandler);
      };
      this.touchEndHandler = e => {
        if (e.target === null) return;
        const optionItem = e.target.closest('[data-option-index]');
        if (optionItem === null) return;
        e.preventDefault();
        if (this._hasMoved(e)) {
          this.touchMoveEvent = undefined;
          return;
        }
        if (optionItem.closest('[aria-disabled=true]')) {
          return; // Abort if the item or an ancestor is disabled
        }
        const optionIndex = optionItem.getAttribute('data-option-index');
        if (optionIndex === null) return;
        this.args.select.actions.choose(this._optionFromIndex(optionIndex), e);
      };
      element.addEventListener('touchstart', this.touchStartHandler);
      element.addEventListener('touchend', this.touchEndHandler);
    }
    this.args.select.actions.scrollTo(this.args.select.highlighted);
  }
  _removeHandlers(element) {
    element.removeEventListener('mouseup', this.mouseUpHandler);
    element.removeEventListener('mouseover', this.mouseOverHandler);
    element.removeEventListener('touchstart', this.touchStartHandler);
    element.removeEventListener('touchmove', this.touchMoveHandler);
    element.removeEventListener('touchend', this.touchEndHandler);
  }
}
setComponentTemplate(TEMPLATE, PowerSelectOptionsComponent);

export { PowerSelectOptionsComponent as default };
//# sourceMappingURL=options.js.map
