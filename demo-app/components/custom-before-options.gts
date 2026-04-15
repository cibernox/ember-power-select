import PowerSelectBeforeOptions from '#src/components/power-select/before-options.gts';

export default class CustomBeforeOptions<
  T,
  TExtra = undefined,
> extends PowerSelectBeforeOptions<T, TExtra> {
  <template>
    <p id="custom-before-options-p-tag">
      {{@placeholder}}
    </p>
    {{#if @placeholderComponent}}
      <@placeholderComponent
        @placeholder={{@placeholder}}
        @select={{@select}}
      />
    {{/if}}
  </template>
}
