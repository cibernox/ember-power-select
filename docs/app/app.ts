import Application from '@ember/application';
import compatModules from '@embroider/virtual/compat-modules';
import setupInspector from '@embroider/legacy-inspector-support/ember-source-4.12';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';
import { importSync, isDevelopingApp, macroCondition } from '@embroider/macros';
import { setConfig } from 'ember-basic-dropdown/config';

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
  inspector = setupInspector(this);
}

loadInitializers(App, config.modulePrefix, compatModules);
