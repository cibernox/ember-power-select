import EmberPowerSelect from 'ember-power-select/components/power-select';
import { inject as service } from '@ember/service';

export default class extends EmberPowerSelect {
  @service intl;
  searchEnabled = false;
  allowClear = true;

  get loadingMessage() {
    return this.intl.t('selects.loading');
  }
}
