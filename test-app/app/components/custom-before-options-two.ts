import PowerSelectBeforeOptionsComponent from 'ember-power-select/components/power-select/before-options';
import type { SelectedCountryExtra } from 'test-app/utils/constants';

export default class CustomBeforeOptionsTwo<
  T,
> extends PowerSelectBeforeOptionsComponent<T, SelectedCountryExtra> {}
