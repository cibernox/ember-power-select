import PowerSelectPlaceholder from 'ember-power-select/components/power-select/placeholder';

export default class CustomMultipleSearchPlaceholder<
  T,
  TExtra = unknown,
  IsMultiple extends boolean = false,
> extends PowerSelectPlaceholder<T, TExtra, IsMultiple> {
  <template>
    {{#if @displayPlaceholder}}
      <div class="ember-power-select-placeholder">
        This is a very
        <span style="font-weight:bold">
          bold
        </span>
        placeholder
      </div>
    {{/if}}

    <@inputComponent
      @select={{@select}}
      style={{if @displayPlaceholder "position: absolute; top: 0; left: 0;"}}
    />
  </template>
}
