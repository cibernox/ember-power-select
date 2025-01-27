import Component from '@glimmer/component';
import type { Select, TSearchFieldPosition } from '../power-select';
interface PowerSelectInputSignature {
    Element: HTMLElement;
    Args: {
        select: Select;
        ariaLabel?: string;
        ariaLabelledBy?: string;
        ariaDescribedBy?: string;
        role?: string;
        searchPlaceholder?: string;
        searchFieldPosition?: TSearchFieldPosition;
        ariaActiveDescendant?: string;
        listboxId?: string;
        onKeydown: (e: KeyboardEvent) => false | void;
        onBlur: (e: FocusEvent) => void;
        onFocus: (e: FocusEvent) => void;
        onInput: (e: InputEvent) => boolean;
        autofocus?: boolean;
    };
}
export default class PowerSelectInput extends Component<PowerSelectInputSignature> {
    didSetup: boolean;
    handleKeydown(e: KeyboardEvent): false | void;
    handleInput(event: Event): false | void;
    handleBlur(event: Event): void;
    setupInput: import("ember-modifier").FunctionBasedModifier<{
        Args: {
            Positional: unknown[];
            Named: import("ember-modifier/-private/signature").EmptyObject;
        };
        Element: HTMLElement;
    }>;
    private _focusInput;
}
export {};
//# sourceMappingURL=input.d.ts.map