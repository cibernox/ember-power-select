import Component from '@glimmer/component';
import { guidFor } from '@ember/object/internals';

interface PowerSelectPowerSelectGroupSignature {
  Element: HTMLElement;
  Args: {
    group: any;
  };
  Blocks: {
    default: [];
  };
}

export default class PowerSelectGroupComponent extends Component<PowerSelectPowerSelectGroupSignature> {
  uniqueId = guidFor(this);
}
