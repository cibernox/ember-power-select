import Component from '@glimmer/component';
import type { Select, TSearchFieldPosition } from '../power-select';
import type { ComponentLike } from '@glint/template';
export interface PowerSelectInputSignature {
    Element: HTMLElement;
    Args: {
        select: Select;
        ariaLabel?: string;
        ariaLabelledBy?: string;
        ariaDescribedBy?: string;
        role?: string;
        searchField?: string;
        searchPlaceholder?: string;
        placeholder?: string;
        searchFieldPosition?: TSearchFieldPosition;
        ariaActiveDescendant?: string;
        isDefaultPlaceholder?: boolean;
        listboxId?: string;
        autofocus?: boolean;
        tabindex?: number | string;
        placeholderComponent?: string | ComponentLike<any>;
        onKeydown?: (e: KeyboardEvent) => boolean | void;
        onBlur?: (e: FocusEvent) => void;
        onFocus?: (e: FocusEvent) => void;
        onInput?: (e: InputEvent) => void | boolean;
        buildSelection: (lastSelection: any, select: Select) => any[];
    };
}
export default class PowerSelectInput extends Component<PowerSelectInputSignature> {
    didSetup: boolean;
    private _lastIsOpen;
    get placeholder(): string | undefined;
    handleKeydown(e: KeyboardEvent): false | void;
    handleInput(event: Event): false | void;
    handleBlur(event: Event): void;
    handleFocus(event: Event): void;
    setupInput: import("ember-modifier").FunctionBasedModifier<{
        Args: {
            Positional: unknown[];
            Named: import("ember-modifier/-private/signature").EmptyObject;
        };
        Element: HTMLElement;
    }>;
    openChange: import("ember-modifier").FunctionBasedModifier<{
        Args: {
            Positional: [boolean];
            Named: import("ember-modifier/-private/signature").EmptyObject;
        };
        Element: HTMLElement;
    }>;
    private _openChanged;
    private _focusInput;
    private focusLaterTask;
}
//# sourceMappingURL=input.d.ts.map