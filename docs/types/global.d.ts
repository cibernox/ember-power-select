import '@glint/environment-ember-loose';
import EmberPowerSelectRegistry from 'ember-power-select/template-registry';

export interface GetCodeSnippetHelperRegistry {
  [key: string]: any;
}

export interface CodeBlockRegistry {
  [key: string]: any;
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry
    extends EmberPowerSelectRegistry,
      GetCodeSnippetHelperRegistry,
      CodeBlockRegistry {}
}
