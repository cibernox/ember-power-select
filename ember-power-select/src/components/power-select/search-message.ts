import templateOnly from '@ember/component/template-only';

export interface PowerSelectSearchMessageSignature {
  Element: HTMLElement;
  Args: {
    searchMessage: string;
  };
}

export default templateOnly<PowerSelectSearchMessageSignature>();
