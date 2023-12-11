import Component from '@glimmer/component';
import type { ComponentLike } from '@glint/template';

interface Args {
  Element: HTMLElement;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isMutlipleWithSearch: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  placeholder: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inputComponent?: any;
}

export default class PlaceholderComponent extends Component<Args> {}
