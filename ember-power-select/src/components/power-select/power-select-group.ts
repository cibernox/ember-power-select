import Component from '@glimmer/component';
import { guidFor } from '@ember/object/internals';
import type { Group } from '../../utils/group-utils';
import type { Select } from '../power-select';

export interface PowerSelectPowerSelectGroupSignature<
  T,
  TExtra = unknown,
  IsMultiple extends boolean = false,
> {
  Element: HTMLElement;
  Args: {
    group: Group<T>;
    select: Select<T, IsMultiple>;
    extra?: TExtra;
  };
  Blocks: {
    default: [];
  };
}

export default class PowerSelectPowerSelectGroupComponent<
  T,
  TExtra = unknown,
  IsMultiple extends boolean = false,
> extends Component<
  PowerSelectPowerSelectGroupSignature<T, TExtra, IsMultiple>
> {
  uniqueId = guidFor(this);
}
