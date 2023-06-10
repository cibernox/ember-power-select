import EmberPowerSelect from 'ember-power-select/components/power-select';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default class extends EmberPowerSelect {
  @service intl
  searchEnabled = false
  allowClear = true

  // You can even use computed properties to do other stuff, like apply intl, that wouldn't be
  // possible with static configuration.
  @computed('intl.locale')
  get loadingMessage() {
    return this.intl.t('selects.loading');
  }
}
