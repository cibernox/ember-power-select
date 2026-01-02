import Component from '@glimmer/component';
import RouteTemplate from 'ember-route-template';
import ShadowRoot from '../components/shadow-root';
import BasicDropdownWormhole from 'ember-basic-dropdown/components/basic-dropdown-wormhole';
import type Owner from '@ember/owner';

// @ts-expect-error Cannot find name 'FastBoot'.
const isFastBoot = typeof FastBoot !== 'undefined';

class Application extends Component {
  shadowDom = false;

  constructor(owner: Owner, args: object) {
    super(owner, args);

    if (import.meta.env.VITE_SHADOW_DOM_BUILD === 'true') {
      this.shadowDom = true;
    }

    if (!this.shadowDom || isFastBoot) {
      return;
    }

    customElements.define(
      'shadow-root',
      class extends HTMLElement {
        connectedCallback() {
          this.attachShadow({ mode: 'open' });
        }
      },
    );
  }

  <template>
    <ShadowRoot>
      <BasicDropdownWormhole />

      {{outlet}}
    </ShadowRoot>
  </template>
}

export default RouteTemplate(Application);
