import templateOnly from '@ember/component/template-only';

export interface CustomTriggerComponentSignature {
  Element: Element;
  Args: {
    loadingMessage: string;
  };
}

export default templateOnly<CustomTriggerComponentSignature>();
