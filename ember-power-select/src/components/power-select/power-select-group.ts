import Component from '@glimmer/component';
import { guidFor } from '@ember/object/internals';
import type { GroupObject, Select } from '../power-select';
import type { Group } from '../../utils/group-utils';

export interface PowerSelectPowerSelectGroupSignature<
  T,
  TExtra = unknown,
  IsMultiple extends boolean = false,
> {
  Element: HTMLElement;
  Args: {
    group: GroupObject<T>;
    select: Select<T, IsMultiple>;
    extra?: TExtra;
  };
  Blocks: {
    default: [];
  };
}

export default class PowerSelectPowerSelectGroupComponent<
  T extends Group,
  TExtra = unknown,
  IsMultiple extends boolean = false,
> extends Component<
  PowerSelectPowerSelectGroupSignature<T, TExtra, IsMultiple>
> {
  uniqueId = guidFor(this);

  get disabled() {
    return this.args.group.disabled;
  }
}
