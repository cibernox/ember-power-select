import Component from '@glimmer/component';
import { action } from '@ember/object';
import type { Select } from '../power-select';
import type { ComponentLike } from '@glint/template';
declare const FastBoot: any;

interface PowerSelectOptionsSignature {
  Element: HTMLElement;
  Args: PowerSelectOptionsArgs;
  Blocks: {
    default: [opt: PowerSelectOptionsArgs, select: Select];
  };
}

interface PowerSelectOptionsArgs {
  select: Select;
  highlightOnHover?: boolean;
  groupIndex: string;
  loadingMessage: string;
  options: any[];
  extra: any;
  groupComponent?: string | ComponentLike<any>;
  optionsComponent?: string | ComponentLike<any>;
}

const isTouchDevice = !!window && 'ontouchstart' in window;
if (typeof FastBoot === 'undefined') {
  (function (ElementProto) {
    if (typeof ElementProto.matches !== 'function') {
      ElementProto.matches =
        (ElementProto as any).msMatchesSelector ||
        (ElementProto as any).mozMatchesSelector ||
        ElementProto.webkitMatchesSelector;
    }

    if (typeof ElementProto.closest !== 'function') {
      ElementProto.closest = function closest(selector: string) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
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

export default class PowerSelectOptionsComponent extends Component<PowerSelectOptionsSignature> {
  private isTouchDevice = this.args.extra?._isTouchDevice || isTouchDevice;
  private touchMoveEvent?: TouchEvent;
  private mouseOverHandler: EventListener = ((
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _: MouseEvent,
  ): void => {}) as EventListener;
  private mouseUpHandler: EventListener = ((
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _: MouseEvent,
  ): void => {}) as EventListener;
  private touchEndHandler: EventListener = ((
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _: TouchEvent,
  ): void => {}) as EventListener;
  private touchMoveHandler: EventListener = ((
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _: TouchEvent,
  ): void => {}) as EventListener;
  private touchStartHandler: EventListener = ((
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _: TouchEvent,
  ): void => {}) as EventListener;

  @action
  addHandlers(element: Element) {
    const role = element.getAttribute('role');
    if (role === 'group') {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/ban-types
    const findOptionAndPerform = (action: Function, e: MouseEvent): void => {
      if (e.target === null) return;
      const optionItem = (e.target as Element).closest('[data-option-index]');
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
    this.mouseUpHandler = ((e: MouseEvent): void =>
      findOptionAndPerform(
        this.args.select.actions.choose,
        e,
      )) as EventListener;
    element.addEventListener('mouseup', this.mouseUpHandler);
    if (this.args.highlightOnHover) {
      this.mouseOverHandler = ((e: MouseEvent): void =>
        findOptionAndPerform(
          this.args.select.actions.highlight,
          e,
        )) as EventListener;
      element.addEventListener('mouseover', this.mouseOverHandler);
    }
    if (this.isTouchDevice) {
      this.touchMoveHandler = ((e: TouchEvent): void => {
        this.touchMoveEvent = e;
        if (element) {
          element.removeEventListener('touchmove', this.touchMoveHandler);
        }
      }) as EventListener;
      // Add touch event handlers to detect taps
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      this.touchStartHandler = ((_: TouchEvent): void => {
        element.addEventListener('touchmove', this.touchMoveHandler);
      }) as EventListener;
      this.touchEndHandler = ((e: TouchEvent): void => {
        if (e.target === null) return;
        const optionItem = (e.target as Element).closest('[data-option-index]');
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
      }) as EventListener;
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
    const parts = index.split('.');
    let option = this.args.options[parseInt(parts[0] ?? '', 10)];
    for (let i = 1; i < parts.length; i++) {
      option = option.options[parseInt(parts[i] ?? '', 10)];
    }
    return option;
  }

  _hasMoved(endEvent: TouchEvent): boolean {
    const moveEvent = this.touchMoveEvent;
    if (!moveEvent) {
      return false;
    }

    if (!moveEvent.changedTouches) {
      return false;
    }

    if (
      !endEvent.changedTouches?.[0] ||
      (moveEvent.changedTouches[0] as any).touchType !== 'stylus'
    ) {
      return true;
    }

    const changedTouch = moveEvent.changedTouches[0];

    // Distinguish stylus scroll and tap: if touch "distance" < 5px, we consider it a tap
    const horizontalDistance = Math.abs(
      (changedTouch?.pageX ?? 0) - endEvent.changedTouches[0].pageX,
    );
    const verticalDistance = Math.abs(
      (changedTouch?.pageY ?? 0) - endEvent.changedTouches[0].pageY,
    );
    return horizontalDistance >= 5 || verticalDistance >= 5;
  }
}
