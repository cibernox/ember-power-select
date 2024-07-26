import templateOnly from '@ember/component/template-only';

export interface CustomGroupComponentWithVariantSignature {
  Element: Element;
  Args: {
    group: {
      groupName: string;
      variant: string;
    };
  };
  Blocks: {
    default: [];
  };
}

export default templateOnly<CustomGroupComponentWithVariantSignature>();
