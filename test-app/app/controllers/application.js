import Controller from '@ember/controller';
import { getOwner } from '@ember/owner';

const isFastBoot = typeof FastBoot !== 'undefined';

export default class extends Controller {
  shadowDom = false;

  constructor() {
    super(...arguments);

    const config = getOwner(this).resolveRegistration('config:environment');

    this.shadowDom = config.APP.shadowDom ?? false;

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
}
