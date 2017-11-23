import { run } from '@ember/runloop';
import { merge } from '@ember/polyfills';
import Application from '../../app';
import config from '../../config/environment';
import registerPowerSelectHelpers from 'ember-power-select/test-support/helpers';

registerPowerSelectHelpers();

export default function startApp(attrs) {
  //...
}
