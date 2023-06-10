import Component from '@glimmer/component';
import { Select } from '../power-select';
interface Args {
    select: Select;
    placeholder?: string;
    searchField: string;
    onInput?: (e: InputEvent) => boolean;
    onKeydown?: (e: KeyboardEvent) => boolean;
    buildSelection: (lastSelection: any, select: Select) => any[];
}
interface IndexAccesible<T> {
    objectAt(index: number): T;
}
export default class Trigger extends Component<Args> {
    private inputFont?;
    private _lastIsOpen;
    textMeasurer: any;
    get triggerMultipleInputStyle(): import("@ember/template/-private/handlebars").SafeString;
    get maybePlaceholder(): string | undefined;
    openChanged(_el: Element, [isOpen]: [boolean]): void;
    storeInputStyles(input: Element): void;
    chooseOption(e: Event): void;
    handleInput(e: InputEvent): void;
    handleKeydown(e: KeyboardEvent): false | void;
    selectedObject<T>(list: IndexAccesible<T> | T[], index: number): T;
}
export {};
