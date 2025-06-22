import Component from '@glimmer/component';
import { guidFor } from '@ember/object/internals';
import type { Group } from '../../utils/group-utils';

export interface PowerSelectPowerSelectGroupSignature<T = unknown> {
  Element: HTMLElement;
  Args: {
    group: Group<T>;
  };
  Blocks: {
    default: [];
  };
}

export default class PowerSelectGroupComponent<T = unknown> extends Component<
  PowerSelectPowerSelectGroupSignature<T>
> {
  uniqueId = guidFor(this);
}
