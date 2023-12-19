import Component from '@glimmer/component';

interface Args {
  Element: HTMLElement;
  isMultipleWithSearch: boolean;
  placeholder: any;
  inputComponent?: any;
}

export default class PlaceholderComponent extends Component<Args> {}
