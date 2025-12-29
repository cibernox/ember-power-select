import RouteTemplate from 'ember-route-template';
import PowerSelect from 'ember-power-select/components/power-select';
import { fn } from '@ember/helper';
import type ShadowRootController from 'test-app/controllers/shadow-root';

export default RouteTemplate<{
  Args: { model: unknown; controller: ShadowRootController };
}>(
  <template>
    <PowerSelect
      @searchEnabled={{true}}
      @options={{@controller.diacritics}}
      @selected={{@controller.selectedDiacritic}}
      @labelText="Name"
      @onChange={{fn (mut @controller.selectedDiacritic)}}
      as |name|
    >
      {{name}}
    </PowerSelect>
  </template>,
);
