import Component from '@glimmer/component';

interface PowerSelectPlaceholderSignature {
  Element: HTMLElement;
  Args: {
    isMultipleWithSearch: boolean;
    placeholder: any;
    inputComponent?: any;
  };
}

export default class PowerSelectPlaceholderComponent extends Component<PowerSelectPlaceholderSignature> {}
