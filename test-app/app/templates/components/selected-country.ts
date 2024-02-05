import templateOnly from '@ember/component/template-only';

export interface SelectedCountrySignature {
  Element: Element;
  Args: {
    select: any;
    extra: any;
  }
}

export default templateOnly<SelectedCountrySignature>();
