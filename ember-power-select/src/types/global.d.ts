import '@glint/environment-ember-loose';

import type EmberTruthRegistry from 'ember-truth-helpers/template-registry';

export interface ReadonlyRegistry {
  [key: string]: any;
}

declare module '@glint/environment-ember-loose/registry' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export default interface Registry
    extends EmberTruthRegistry,
      ReadonlyRegistry /* other registries here */ {
    // ...
  }
}
