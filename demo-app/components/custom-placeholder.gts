import PowerSelectPlaceholder from '#src/components/power-select/placeholder.gts';

export default class CustomPlaceholder<
  T,
  TExtra = unknown,
  IsMultiple extends boolean = false,
> extends PowerSelectPlaceholder<T, TExtra, IsMultiple> {
  <template>
    <div class="ember-power-select-placeholder">
      This is a very
      {{! template-lint-disable no-inline-styles }}
      <span style="font-weight:bold">
        bold
      </span>
      placeholder
    </div>
  </template>
}
