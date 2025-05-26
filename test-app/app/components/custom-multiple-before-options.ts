import templateOnly from '@ember/component/template-only';
import type { ComponentLike } from '@glint/template';
import type { TSearchFieldPosition } from 'ember-power-select/components/power-select';

export interface CustomMultipleBeforeOptionsSignature {
  Element: Element;
  Args: {
    placeholder: string;
    searchEnabled: boolean;
    searchFieldPosition: TSearchFieldPosition;
    placeholderComponent: ComponentLike<any>;
  };
}

export default templateOnly<CustomMultipleBeforeOptionsSignature>();
