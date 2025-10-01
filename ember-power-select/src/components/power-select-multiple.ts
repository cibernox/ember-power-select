import Component from '@glimmer/component';
import type { PowerSelectArgs } from './power-select';
import type { Option, Select } from '../types';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface PowerSelectMultipleArgs<T = unknown, TExtra = unknown>
  extends PowerSelectArgs<T, true, TExtra> {}

export interface PowerSelectMultipleSignature<T, TExtra = unknown> {
  Element: Element;
  Args: PowerSelectMultipleArgs<T, TExtra>;
  Blocks: {
    default: [option: Option<T>, select: Select<T, true>];
  };
}

export default class PowerSelectMultipleComponent<
  T,
  TExtra = unknown,
> extends Component<PowerSelectMultipleSignature<T, TExtra>> {}
