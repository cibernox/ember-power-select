import Component from '@glimmer/component';

interface Args {
  Element: HTMLElement;
  searchMessage: string;
}

export default class SearchMessageComponent extends Component<Args> {}
