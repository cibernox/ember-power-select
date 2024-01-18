import templateOnly from '@ember/component/template-only';

interface PowerSelectNoMatchesMessageSignature {
  Element: HTMLElement;
  Args: {
    noMatchesMessage: any;
  };
}

export default templateOnly<PowerSelectNoMatchesMessageSignature>();
