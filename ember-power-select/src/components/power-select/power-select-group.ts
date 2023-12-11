import Component from '@glimmer/component';

interface Args {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  group: any;
  Blocks: {
    default: [];
  };
}

export default class PowerSelectGroupComponent extends Component<Args> {}
