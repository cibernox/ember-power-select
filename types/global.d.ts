// Types for compiled templates
declare module 'ember-power-select/templates/*' {
  import { TemplateFactory } from 'htmlbars-inline-precompile';
  const tmpl: TemplateFactory;
  export default tmpl;
}
declare module 'ember-concurrency' {
  export type task = Function;
  export type timeout = (ms: number) => void;
}
