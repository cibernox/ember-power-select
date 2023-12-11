import '@glint/environment-ember-loose';

import type EmberTruthRegistry from 'ember-truth-helpers/template-registry';

export interface ReadonlyRegistry {
  [key: string]: any;
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry
    extends EmberTruthRegistry /* other addon registries */ {
    // local entries
  }

  export default interface Registry
    extends ReadonlyRegistry /* other registries here */ {
    // ...
  }
}
