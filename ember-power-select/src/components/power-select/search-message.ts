import Component from '@glimmer/component';

interface PowerSelectSearchMessageSignature {
  Element: HTMLElement;
  Args: {
    searchMessage: string;
  };
}

export default class PowerSelectSearchMessageComponent extends Component<PowerSelectSearchMessageSignature> {}
