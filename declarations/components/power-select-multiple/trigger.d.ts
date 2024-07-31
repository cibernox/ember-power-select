import Component from '@glimmer/component';
import type { Select } from '../power-select';
import type { ComponentLike } from '@glint/template';
interface PowerSelectMultipleTriggerSignature {
    Element: HTMLElement;
    Args: {
        Element: HTMLElement;
        select: Select;
        searchEnabled: boolean;
        placeholder?: string;
        searchField: string;
        listboxId?: string;
        tabindex?: string;
        ariaLabel?: string;
        ariaLabelledBy?: string;
        ariaDescribedBy?: string;
        role?: string;
        ariaActiveDescendant: string;
        extra?: any;
        placeholderComponent?: string | ComponentLike<any>;
        selectedItemComponent?: string | ComponentLike<any>;
        onInput?: (e: InputEvent) => boolean;
        onKeydown?: (e: KeyboardEvent) => boolean;
        onFocus?: (e: FocusEvent) => void;
        onBlur?: (e: FocusEvent) => void;
        buildSelection: (lastSelection: any, select: Select) => any[];
    };
    Blocks: {
        default: [opt: any, select: Select];
    };
}
interface IndexAccesible<T> {
    objectAt(index: number): T;
}
export default class TriggerComponent extends Component<PowerSelectMultipleTriggerSignature> {
    private _lastIsOpen;
    openChanged(element: Element, [isOpen]: [boolean]): void;
    chooseOption(e: Event): void;
    openChange: import("ember-modifier").FunctionBasedModifier<{
        Args: {
            Positional: [boolean];
            Named: import("ember-modifier/-private/signature").EmptyObject;
        };
        Element: Element;
    }>;
    private _openChanged;
    selectedObject<T>(list: IndexAccesible<T> | T[], index: number): T;
}
export {};
//# sourceMappingURL=trigger.d.ts.map