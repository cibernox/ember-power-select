import Component from '@glimmer/component';

interface Args {
  Element: HTMLElement;
  isMutlipleWithSearch: any;
  placeholder: any;
  inputComponent?: any;
}

export default class PlaceholderComponent extends Component<Args> {}
