import Component from '@glimmer/component';
import type { Select } from '../power-select';
export interface PowerSelectLabelSignature {
    Element: HTMLElement;
    Args: {
        select: Select;
        labelText?: string;
        labelId: string;
        triggerId: string;
        extra: any;
    };
}
export default class PowerSelectLabelComponent extends Component<PowerSelectLabelSignature> {
    onLabelClick(e: MouseEvent): void;
}
//# sourceMappingURL=label.d.ts.map