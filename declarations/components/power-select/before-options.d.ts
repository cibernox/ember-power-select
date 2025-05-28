import Component from '@glimmer/component';
import type { Select, TSearchFieldPosition } from '../power-select';
interface PowerSelectBeforeOptionsSignature {
    Element: HTMLElement;
    Args: {
        select: Select;
        searchEnabled: boolean;
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
export default class PowerSelectBeforeOptionsComponent extends Component<PowerSelectBeforeOptionsSignature> {
    didSetup: boolean;
    clearSearch(): void;
    handleKeydown(e: KeyboardEvent): false | void;
    handleInput(event: Event): false | void;
    focusInput(el: HTMLElement): void;
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
//# sourceMappingURL=before-options.d.ts.map