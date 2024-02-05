import '@glint/environment-ember-loose';
import EmberPowerSelectRegistry from 'ember-power-select/template-registry';
import type { EmbroiderUtilRegistry } from '@embroider/util';

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry extends EmbroiderUtilRegistry, EmberPowerSelectRegistry {}
}
