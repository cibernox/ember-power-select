import type { PowerSelectArgs } from './power-select';
import type { Option, Select } from '../types.ts';
import Component from '@glimmer/component';
type PowerSelectMultipleArgs<T, TExtra> = PowerSelectArgs<T, true, TExtra>;
export interface PowerSelectMultipleSignature<T, TExtra = unknown> {
    Element: Element;
    Args: PowerSelectMultipleArgs<T, TExtra>;
    Blocks: {
        default: [option: Option<T>, select: Select<T, true>];
    };
}
export default class PowerSelectMultipleComponent<T, TExtra> extends Component<PowerSelectMultipleSignature<T, TExtra>> {
}
export {};
//# sourceMappingURL=power-select-multiple.d.ts.map