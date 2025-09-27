import Component from '@glimmer/component';
import type {
  Option,
  PowerSelectArgs,
  Select as SingleSelect,
} from './power-select';
import type { Selected as SingleSelected } from './power-select';

export type Selected<T = unknown> = SingleSelected<T, true>;

export type Select<T = unknown> = SingleSelect<T, true>;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface PowerSelectMultipleArgs<T = unknown, TExtra = unknown>
  extends PowerSelectArgs<T, true, TExtra> {}

export interface PowerSelectMultipleSignature<T, TExtra = unknown> {
  Element: Element;
  Args: PowerSelectMultipleArgs<T, TExtra>;
  Blocks: {
    default: [option: Option<T>, select: Select<T>];
  };
}

export default class PowerSelectMultipleComponent<
  T,
  TExtra = unknown,
> extends Component<PowerSelectMultipleSignature<T, TExtra>> {}
