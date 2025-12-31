import EmberApp from 'ember-strict-application-resolver';
import EmberRouter from '@ember/routing/router';
import * as QUnit from 'qunit';
import { setApplication } from '@ember/test-helpers';
import { setup } from 'qunit-dom';
import { start as qunitStart, setupEmberOnerrorValidation } from 'ember-qunit';
import { setConfig, type Config } from 'ember-basic-dropdown/config';
// @ts-expect-error Could not find a declaration file for module '@embroider/macros/src/addon/runtime'.
import { getGlobalConfig } from '@embroider/macros/src/addon/runtime';

class Router extends EmberRouter {
  location = 'none';
  rootURL = '/';
}

class TestApp extends EmberApp {
  modules = {
    './router': Router,
    // add any custom services here
    // import.meta.glob('./services/*', { eager: true }),
  };
}

Router.map(function () {});

export function start() {
  setApplication(
    TestApp.create({
      autoboot: false,
      rootElement: '#ember-testing',
    }),
  );
  setup(QUnit.assert);
  setupEmberOnerrorValidation();
  // //eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  const config = getGlobalConfig()['@embroider/macros'];

  // //eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (config) config.isTesting = true;

  setConfig(defaultBasicDropdownConfig);

  qunitStart();
}

export const defaultBasicDropdownConfig: Config = {
  rootElement:
    import.meta.env.VITE_SHADOW_DOM_BUILD === 'true'
      ? '#ember-basic-dropdown-wormhole'
      : '#ember-testing',
  destination: 'ember-testing', // Workaround, because embroider.isTesting isn't working
};
