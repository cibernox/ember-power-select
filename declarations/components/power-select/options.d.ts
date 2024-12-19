import Component from '@glimmer/component';
import type { Select } from '../power-select';
import type { ComponentLike } from '@glint/template';
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
    listboxId: string;
    groupIndex: string;
    loadingMessage: string;
    options: any[];
    extra: any;
    groupComponent?: string | ComponentLike<any>;
    optionsComponent?: string | ComponentLike<any>;
}
export default class PowerSelectOptionsComponent extends Component<PowerSelectOptionsSignature> {
    private isTouchDevice;
    private touchMoveEvent?;
    private mouseOverHandler;
    private mouseUpHandler;
    private touchEndHandler;
    private touchMoveHandler;
    private touchStartHandler;
    private _listElement;
    private _didHandlerSetup;
    willDestroy(): void;
    addHandlers(element: Element): void;
    removeHandlers(element: Element): void;
    setupHandlers: import("ember-modifier").FunctionBasedModifier<{
        Args: {
            Positional: unknown[];
            Named: import("ember-modifier/-private/signature").EmptyObject;
        };
        Element: Element;
    }>;
    _optionFromIndex(index: string): any;
    _hasMoved(endEvent: TouchEvent): boolean;
    private _addHandlers;
    private _removeHandlers;
}
export {};
//# sourceMappingURL=options.d.ts.map