import Component from '@glimmer/component';
import { action } from '@ember/object';
import { Select } from '../power-select';
declare const FastBoot: any;

interface Args {
  select: Select
  highlightOnHover?: boolean
  options: any[]
}

const isTouchDevice = (!!window && 'ontouchstart' in window);
if(typeof FastBoot === 'undefined'){
  (function(ElementProto) {
    if (typeof ElementProto.matches !== 'function') {
      ElementProto.matches = (ElementProto as any).msMatchesSelector || (ElementProto as any).mozMatchesSelector || ElementProto.webkitMatchesSelector;
    }

    if (typeof ElementProto.closest !== 'function') {
      ElementProto.closest = function closest(selector: string) {
        let element: Element | null = this;
        while (element !== null && element.nodeType === 1) {
          if (element.matches(selector)) {
            return element;
          }
          element = element.parentNode as Element;
        }
        return null;
      };
    }
  })(window.Element.prototype);
}

export default class Options extends Component<Args> {
  private isTouchDevice = isTouchDevice
  private hasMoved = false
  private mouseOverHandler = (_: MouseEvent): void => {}
  private mouseUpHandler = (_: MouseEvent): void => {}
  private touchEndHandler = (_: TouchEvent): void => {}
  private touchMoveHandler = (_: TouchEvent): void => {}
  private touchStartHandler = (_: TouchEvent): void => {}

  @action
  addHandlers(element: Element) {
    let role = element.getAttribute('role');
    if (role === 'group') {
      return;
    }
    let findOptionAndPerform = (action: Function, select: Select, e: Event): void => {
      if (e.target === null) return;
      let optionItem = (e.target as Element).closest('[data-option-index]');
      if (!optionItem) {
        return;
      }
      if (optionItem.closest('[aria-disabled=true]')) {
        return; // Abort if the item or an ancestor is disabled
      }
      let optionIndex = optionItem.getAttribute('data-option-index');
      if (optionIndex === null) return;
      action(this._optionFromIndex(optionIndex), select, e);
    };
    this.mouseUpHandler = (e: MouseEvent): void => findOptionAndPerform(this.args.select.actions.choose, this.args.select, e);
    element.addEventListener('mouseup', this.mouseUpHandler);
    if (this.args.highlightOnHover) {
      this.mouseOverHandler = (e: MouseEvent): void => findOptionAndPerform(this.args.select.actions.highlight, this.args.select, e);
      element.addEventListener('mouseover', this.mouseOverHandler);
    }
    if (this.isTouchDevice) {
      this.touchMoveHandler = (_: TouchEvent): void => {
        this.hasMoved = true;
        if (element) {
          element.removeEventListener('touchmove', this.touchMoveHandler);
        }
      }
      // Add touch event handlers to detect taps
      this.touchStartHandler = (_: TouchEvent): void => {
        element.addEventListener('touchmove', this.touchMoveHandler);
      }
      this.touchEndHandler = (e: TouchEvent): void => {
        if (e.target === null) return;
        let optionItem = (e.target as Element).closest('[data-option-index]');
        if (optionItem === null) return;
        e.preventDefault();
        if (this.hasMoved) {
          this.hasMoved = false;
          return;
        }

        if (optionItem.closest('[aria-disabled=true]')) {
          return; // Abort if the item or an ancestor is disabled
        }

        let optionIndex = optionItem.getAttribute('data-option-index');
        if (optionIndex === null) return;
        this.args.select.actions.choose(this._optionFromIndex(optionIndex), e);
      }
      element.addEventListener('touchstart', this.touchStartHandler);
      element.addEventListener('touchend', this.touchEndHandler);
    }
    if (role !== 'group') {
      this.args.select.actions.scrollTo(this.args.select.highlighted);
    }
  }

  @action
  removeHandlers(element: Element) {
    element.removeEventListener('mouseup', this.mouseUpHandler);
    element.removeEventListener('mouseover', this.mouseOverHandler);
    element.removeEventListener('touchstart', this.touchStartHandler);
    element.removeEventListener('touchmove', this.touchMoveHandler);
    element.removeEventListener('touchend', this.touchEndHandler);
  }

  _optionFromIndex(index: string) {
    let parts = index.split('.');
    let option = this.args.options[parseInt(parts[0], 10)];
    for (let i = 1; i < parts.length; i++) {
      option = option.options[parseInt(parts[i], 10)];
    }
    return option;
  }
}
