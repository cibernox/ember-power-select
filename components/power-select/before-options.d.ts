import Component from '@glimmer/component';
import { Select } from '../power-select';
interface Args {
    select: Select;
    onKeydown: (e: Event) => false | void;
    autofocus?: boolean;
}
export default class BeforeOptions extends Component<Args> {
    clearSearch(): void;
    handleKeydown(e: KeyboardEvent): false | void;
    focusInput(el: HTMLElement): void;
}
export {};
