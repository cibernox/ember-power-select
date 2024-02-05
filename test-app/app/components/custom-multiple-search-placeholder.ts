import templateOnly from '@ember/component/template-only';
import type { ComponentLike } from '@glint/template';

export interface CustomMultipleSearchPlaceholderSignature {
  Element: Element;
  Args: {
    displayPlaceholder: boolean;
    inputComponent: ComponentLike<any>;
  };
}

export default templateOnly<CustomMultipleSearchPlaceholderSignature>();
