import templateOnly from '@ember/component/template-only';

interface PowerSelectSearchMessageSignature {
  Element: HTMLElement;
  Args: {
    searchMessage: string;
  };
}

export default templateOnly<PowerSelectSearchMessageSignature>();
