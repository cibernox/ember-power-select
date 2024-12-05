import Component from '@glimmer/component';
import type { Select } from '../power-select';
interface PowerSelectMultipleInputSignature {
    Element: HTMLElement;
    Args: {
        select: Select;
        placeholder?: string;
        searchField: string;
        tabindex?: string;
        listboxId?: string;
        ariaLabel?: string;
        ariaActiveDescendant?: string;
        ariaLabelledBy?: string;
        ariaDescribedBy?: string;
        role?: string;
        placeholderComponent?: string;
        isDefaultPlaceholder?: boolean;
        onInput?: (e: InputEvent) => boolean;
        onKeydown?: (e: KeyboardEvent) => boolean;
        onFocus: (e: FocusEvent) => void;
        onBlur: (e: FocusEvent) => void;
        buildSelection: (lastSelection: any, select: Select) => any[];
    };
}
export default class PowerSelectMultipleInputComponent extends Component<PowerSelectMultipleInputSignature> {
    get maybePlaceholder(): string | undefined;
    handleInput(event: Event): void;
    handleKeydown(event: Event): false | void;
}
export {};
//# sourceMappingURL=input.d.ts.map