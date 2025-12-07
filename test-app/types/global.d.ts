import '@glint/environment-ember-loose';
import EmberPowerSelectRegistry from 'ember-power-select/template-registry';
import type { EmbroiderUtilRegistry } from '@embroider/util';
import type EmberTruthRegistry from 'ember-truth-helpers/template-registry';
import type EmberConcurrencyRegistry from 'ember-concurrency/template-registry';

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry
    extends
      EmbroiderUtilRegistry,
      EmberPowerSelectRegistry,
      EmberTruthRegistry,
      EmberConcurrencyRegistry {}
}
