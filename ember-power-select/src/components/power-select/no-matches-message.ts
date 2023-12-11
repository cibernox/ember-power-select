import Component from '@glimmer/component';

interface Args {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  noMatchesMessage: any;
}

export default class NoMatchesMessageComponent extends Component<Args> {}
