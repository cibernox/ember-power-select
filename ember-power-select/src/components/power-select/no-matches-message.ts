import templateOnly from '@ember/component/template-only';

export interface PowerSelectNoMatchesMessageSignature {
  Element: HTMLElement;
  Args: {
    noMatchesMessage?: string;
  };
}

export default templateOnly<PowerSelectNoMatchesMessageSignature>();
