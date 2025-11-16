import Component from '@glimmer/component';
import type { Select, TSearchFieldPosition } from '../power-select';
import type { ComponentLike } from '@glint/template';
interface IndexAccesible<T> {
    objectAt(index: number): T;
}
interface PowerSelectTriggerSignature {
    Element: HTMLElement;
    Args: {
        select: Select;
        allowClear: boolean;
        searchEnabled: boolean;
        placeholder?: string;
        searchPlaceholder?: string;
        searchField: string;
        searchFieldPosition?: TSearchFieldPosition;
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
        default: [selected: any, select: Select];
    };
}
export default class PowerSelectTriggerComponent extends Component<PowerSelectTriggerSignature> {
    private _lastIsOpen;
    clear(e: Event): false | void;
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