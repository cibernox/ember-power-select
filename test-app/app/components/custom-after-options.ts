import templateOnly from '@ember/component/template-only';
import type { PowerSelectAfterOptionsSignature } from 'ember-power-select/components/power-select';
import type { Country, SelectedCountryExtra } from 'test-app/utils/constants';

export default templateOnly<PowerSelectAfterOptionsSignature<Country, SelectedCountryExtra>>();
