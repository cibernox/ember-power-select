import templateOnly from '@ember/component/template-only';
import type { ComponentLike } from '@glint/template';

export interface CustomBeforeOptionsSignature {
  Element: Element;
  Args: {
    placeholder: string;
    placeholderComponent: ComponentLike<any>;
  };
}

export default templateOnly<CustomBeforeOptionsSignature>();
