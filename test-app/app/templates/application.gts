import RouteTemplate from 'ember-route-template';
import ShadowRoot from '../components/shadow-root';
import BasicDropdownWormhole from 'ember-basic-dropdown/components/basic-dropdown-wormhole';

export default RouteTemplate<{ Args: { model: unknown; controller: unknown } }>(
  <template>
    <ShadowRoot>
      <BasicDropdownWormhole />

      {{outlet}}
    </ShadowRoot>
  </template>,
);
