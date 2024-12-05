import Component from '@glimmer/component';
import type { Select } from '../power-select';
import type { ComponentLike } from '@glint/template';
interface PowerSelectTriggerSignature {
    Element: HTMLElement;
    Args: {
        select: Select;
        allowClear: boolean;
        extra: any;
        placeholder?: string;
        placeholderComponent?: string | ComponentLike<any>;
        selectedItemComponent?: string | ComponentLike<any>;
    };
    Blocks: {
        default: [selected: any, select: Select];
    };
}
export default class PowerSelectTriggerComponent extends Component<PowerSelectTriggerSignature> {
    clear(e: Event): false | void;
}
export {};
//# sourceMappingURL=trigger.d.ts.map