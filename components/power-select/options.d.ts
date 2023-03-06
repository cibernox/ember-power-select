import Component from '@glimmer/component';
import { Select } from '../power-select';
interface Args {
    select: Select;
    highlightOnHover?: boolean;
    options: any[];
    extra: any;
}
export default class Options extends Component<Args> {
    private isTouchDevice;
    private touchMoveEvent?;
    private mouseOverHandler;
    private mouseUpHandler;
    private touchEndHandler;
    private touchMoveHandler;
    private touchStartHandler;
    addHandlers(element: Element): void;
    removeHandlers(element: Element): void;
    _optionFromIndex(index: string): any;
    _hasMoved(endEvent: TouchEvent): boolean;
}
export {};
