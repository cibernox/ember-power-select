import Component from '@glimmer/component';
import { PowerSelectArgs, Select } from './power-select';
interface PowerSelectMultipleArgs extends PowerSelectArgs {
}
export default class PowerSelectMultiple extends Component<PowerSelectMultipleArgs> {
    get computedTabIndex(): string | number;
    handleOpen(select: Select, e: Event): false | void;
    handleFocus(select: Select, e: FocusEvent): void;
    handleKeydown(select: Select, e: KeyboardEvent): false | void;
    defaultBuildSelection(option: any, select: Select): any;
    focusInput(select: Select): void;
}
export {};
