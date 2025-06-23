import templateOnly from '@ember/component/template-only';
import type { ComponentLike } from '@glint/template';
import type { PowerSelectInputSignature } from './input';

export interface PowerSelectPlaceholderSignature {
  Element: HTMLElement;
  Args: {
    isMultipleWithSearch: boolean;
    placeholder?: string;
    inputComponent?: string | ComponentLike<PowerSelectInputSignature>;
  };
}

export default templateOnly<PowerSelectPlaceholderSignature>();
