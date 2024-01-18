import templateOnly from '@ember/component/template-only';

interface PowerSelectPlaceholderSignature {
  Element: HTMLElement;
  Args: {
    isMultipleWithSearch: boolean;
    placeholder: any;
    inputComponent?: any;
  };
}

export default templateOnly<PowerSelectPlaceholderSignature>();
