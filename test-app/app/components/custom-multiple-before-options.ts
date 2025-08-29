import templateOnly from '@ember/component/template-only';
import type { PowerSelectBeforeOptionsSignature } from 'ember-power-select/components/power-select/before-options';
import type { Country, SelectedCountryExtra } from 'test-app/utils/constants';

export type CustomMultipleBeforeOptionsSignature =
  PowerSelectBeforeOptionsSignature<Country, SelectedCountryExtra, true>;

export default templateOnly<CustomMultipleBeforeOptionsSignature>();
