import Component from '@glimmer/component';
import type { PowerSelectSignature, Select } from './power-select';
interface PowerSelectMultipleSignature extends PowerSelectSignature {
}
export default class PowerSelectMultipleComponent extends Component<PowerSelectMultipleSignature> {
    get computedTabIndex(): string | number;
    handleOpen(select: Select, e: Event): false | void;
    handleFocus(select: Select, e: FocusEvent): void;
    handleKeydown(select: Select, e: KeyboardEvent): false | void;
    defaultBuildSelection(option: any, select: Select): any[];
    focusInput(select: Select): void;
}
export {};
//# sourceMappingURL=power-select-multiple.d.ts.map