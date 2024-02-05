import templateOnly from '@ember/component/template-only';

export interface CustomNoMatchesMessageSignature {
  Element: Element;
  Args: {
    noMatchesMessage: string;
  };
}

export default templateOnly<CustomNoMatchesMessageSignature>();
