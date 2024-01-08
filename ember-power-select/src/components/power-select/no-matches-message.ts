import Component from '@glimmer/component';

interface PowerSelectNoMatchesMessageSignature {
  Element: HTMLElement;
  Args: {
    noMatchesMessage: any;
  };
}

export default class PowerSelectNoMatchesMessageComponent extends Component<PowerSelectNoMatchesMessageSignature> {}
