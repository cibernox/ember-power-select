import templateOnly from '@ember/component/template-only';

export interface CustomTriggerThatHandlesFocusSignature {
  Element: Element;
  Args: {
    onFocus: any;
  };
}

export default templateOnly<CustomTriggerThatHandlesFocusSignature>();
