import Component from '@glimmer/component';
import type { PowerSelectArgs, PowerSelectSignature, Select } from './power-select';
import type Owner from '@ember/owner';
interface PowerSelectMultipleSignature extends PowerSelectSignature {
}
export default class PowerSelectMultipleComponent extends Component<PowerSelectMultipleSignature> {
    constructor(owner: Owner, args: PowerSelectArgs);
    get computedTabIndex(): string | number;
    handleOpen(select: Select, e: Event): false | void;
    handleFocus(select: Select, e: FocusEvent): void;
    handleKeydown(select: Select, e: KeyboardEvent): false | void;
    defaultBuildSelection(option: any, select: Select): any[];
    focusInput(select: Select): void;
}
export {};
//# sourceMappingURL=power-select-multiple.d.ts.map