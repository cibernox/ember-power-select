import '@glint/environment-ember-loose';
import EmberPowerSelectRegistry from 'ember-power-select/template-registry';

export interface GetCodeSnippetHelperRegistry {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface CodeBlockRegistry {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry
    extends EmberPowerSelectRegistry,
      GetCodeSnippetHelperRegistry,
      CodeBlockRegistry {}
}
