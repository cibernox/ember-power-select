import '@glint/environment-ember-loose';

import type EmberTruthRegistry from 'ember-truth-helpers/template-registry';
import type BasicDropdown from 'ember-basic-dropdown/template-registry';
import type EmberPowerSelect from '../template-registry';
import type { EmbroiderUtilRegistry } from '@embroider/util';

// export interface ReadonlyRegistry {
//   [key: string]: any;
// }

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry
    extends EmberTruthRegistry,
      BasicDropdown,
      EmberPowerSelect,
      EmbroiderUtilRegistry /* other registries here */ {
    // ...
  }
}
