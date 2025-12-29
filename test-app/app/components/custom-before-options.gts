import PowerSelectBeforeOptionsComponent from 'ember-power-select/components/power-select/before-options';
import { ensureSafeComponent } from '@embroider/util';

export default class CustomBeforeOptions<
  T,
  TExtra = undefined,
> extends PowerSelectBeforeOptionsComponent<T, TExtra> {
  <template>
    <p id="custom-before-options-p-tag">
      {{@placeholder}}
    </p>
    {{#if @placeholderComponent}}
      {{#let
        (component (ensureSafeComponent @placeholderComponent this))
        as |ComponentName|
      }}
        <ComponentName @placeholder={{@placeholder}} @select={{@select}} />
      {{/let}}
    {{/if}}
  </template>
}
