import Component from '@glimmer/component';
import { Select } from '../power-select';
interface Args {
    select: Select;
}
export default class Trigger extends Component<Args> {
    clear(e: Event): false | void;
}
export {};
