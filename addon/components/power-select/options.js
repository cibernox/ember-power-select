import Component from '@glimmer/component';
import { action } from '@ember/object';

const isTouchDevice = (!!window && 'ontouchstart' in window);
if(typeof FastBoot === 'undefined'){
  (function(ElementProto) {
    if (typeof ElementProto.matches !== 'function') {
      ElementProto.matches = ElementProto.msMatchesSelector || ElementProto.mozMatchesSelector || ElementProto.webkitMatchesSelector;
    }

    if (typeof ElementProto.closest !== 'function') {
      ElementProto.closest = function closest(selector) {
        let element = this;
        while (element && element.nodeType === 1) {
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

export default class Options extends Component {
  isTouchDevice = isTouchDevice

  @action
  addHandlers(element) {
    let role = element.getAttribute('role');
    if (role === 'group') {
      return;
    }
    let findOptionAndPerform = (action, select, e) => {
      let optionItem = e.target.closest('[data-option-index]');
      if (!optionItem) {
        return;
      }
      if (optionItem.closest('[aria-disabled=true]')) {
        return; // Abort if the item or an ancestor is disabled
      }
      let optionIndex = optionItem.getAttribute('data-option-index');
      action(this._optionFromIndex(optionIndex), select, e);
    };
    element.addEventListener('mouseup', (e) => findOptionAndPerform(this.args.select.actions.choose, this.args.select, e));
    if (this.args.highlightOnHover) {
      element.addEventListener('mouseover', (e) => findOptionAndPerform(this.args.select.actions.highlight, this.args.select, e));
    }
    if (this.isTouchDevice) {
      let touchMoveHandler = () => {
        this.hasMoved = true;
        if (element) {
          element.removeEventListener('touchmove', touchMoveHandler);
        }
      };
      // Add touch event handlers to detect taps
      element.addEventListener('touchstart', () => {
        element.addEventListener('touchmove', touchMoveHandler);
      });
      element.addEventListener('touchend', (e) => {
        let optionItem = e.target.closest('[data-option-index]');

        if (!optionItem) {
          return;
        }

        e.preventDefault();
        if (this.hasMoved) {
          this.hasMoved = false;
          return;
        }

        if (optionItem.closest('[aria-disabled=true]')) {
          return; // Abort if the item or an ancestor is disabled
        }

        let optionIndex = optionItem.getAttribute('data-option-index');
        this.args.select.actions.choose(this._optionFromIndex(optionIndex), e);
      });
    }
    if (role !== 'group') {
      this.args.select.actions.scrollTo(this.args.select.highlighted, this.args.select);
    }
  }

  _optionFromIndex(index) {
    let parts = index.split('.');
    let option = this.args.options[parseInt(parts[0], 10)];
    for (let i = 1; i < parts.length; i++) {
      option = option.options[parseInt(parts[i], 10)];
    }
    return option;
  }
}
