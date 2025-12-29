import RouteTemplate from 'ember-route-template'
import PowerSelect from "ember-power-select/components/power-select";
import { fn } from "@ember/helper";
export default RouteTemplate<{ Args: { model: unknown, controller: unknown } }>(<template><PowerSelect @searchEnabled={{true}} @options={{@controller.diacritics}} @selected={{@controller.selectedDiacritic}} @labelText="Name" @onChange={{fn (mut @controller.selectedDiacritic)}} as |name|>
  {{name}}
</PowerSelect></template>)