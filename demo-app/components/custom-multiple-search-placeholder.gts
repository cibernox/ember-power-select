import PowerSelectPlaceholder from '#src/components/power-select/placeholder.gts';
import { htmlSafe } from '@ember/template';

export default class CustomMultipleSearchPlaceholder<
  T,
  TExtra = unknown,
  IsMultiple extends boolean = false,
> extends PowerSelectPlaceholder<T, TExtra, IsMultiple> {
  <template>
    {{#if @displayPlaceholder}}
      <div class="ember-power-select-placeholder">
        This is a very
        {{! template-lint-disable no-inline-styles }}
        <span style="font-weight:bold">
          bold
        </span>
        placeholder
      </div>
    {{/if}}

    <@inputComponent
      @select={{@select}}
      style={{if
        @displayPlaceholder
        (htmlSafe "position: absolute; top: 0; left: 0;")
      }}
    />
  </template>
}
