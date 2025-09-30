import config from 'test-app/config/environment';

// @ts-expect-error Public property 'isFastBoot' of exported class
const isFastBoot = typeof FastBoot !== 'undefined';

export function initialize(appInstance) {
  if (config.environment !== 'test' || isFastBoot || !config.APP.shadowDom) {
    return;
  }

  let appRootElement = appInstance.rootElement;

  if (typeof appRootElement === 'string') {
    appRootElement = document.querySelector(appRootElement);
  }
  const targetElement =
    appRootElement || document.getElementsByTagName('body')[0];

  const hostElement = document.createElement('div');
  hostElement.attachShadow({ mode: 'open' });

  const rootElement = document.createElement('div');
  const wormhole = document.createElement('div');
  wormhole.id = 'ember-basic-dropdown-wormhole';

  hostElement.shadowRoot.appendChild(wormhole);
  hostElement.shadowRoot.appendChild(rootElement);
  targetElement.appendChild(hostElement);

  config.APP.rootElement = '#ember-basic-dropdown-wormhole';
  appInstance.set('rootElement', rootElement);
}

export default {
  initialize,
};
