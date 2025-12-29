import RouteTemplate from 'ember-route-template'
import PowerSelect from "ember-power-select/components/power-select";
import { fn } from "@ember/helper";
export default RouteTemplate<{ Args: { model: unknown, controller: unknown } }>(<template><h2 class="t3">Helpers testing with single select</h2>
<div class="select-choose">
  <PowerSelect @options={{@controller.numbers}} @selected={{@controller.selected}} @onChange={{fn (mut @controller.selected)}} @searchEnabled={{true}} as |num|>
    {{num}}
  </PowerSelect>
</div>

{{#if @controller.selected}}
  <span class="select-choose-target">You've selected: {{@controller.selected}}</span>
{{/if}}</template>)