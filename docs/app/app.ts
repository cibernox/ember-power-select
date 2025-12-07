import Application from '@ember/application';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';
import { importSync, isDevelopingApp, macroCondition } from '@embroider/macros';
import { setConfig } from 'ember-basic-dropdown/config';

import compatModules from '@embroider/virtual/compat-modules';

if (macroCondition(isDevelopingApp())) {
  importSync('./deprecation-workflow');
}

setConfig({
  rootElement: config.APP['rootElement'] as string | undefined,
});

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver.withModules(compatModules);
}

loadInitializers(App, config.modulePrefix, compatModules);
