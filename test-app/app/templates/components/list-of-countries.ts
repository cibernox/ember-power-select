import templateOnly from '@ember/component/template-only';

export interface ListOfCountriesSignature {
  Element: Element;
  Args: {
    extra: any;
    options: any;
  }
}

export default templateOnly<ListOfCountriesSignature>();
