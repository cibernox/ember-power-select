import PowerSelectPlaceholder from 'ember-power-select/components/power-select/placeholder';

export default class CustomPlaceholder<
  T,
  TExtra = unknown,
  IsMultiple extends boolean = false,
> extends PowerSelectPlaceholder<T, TExtra, IsMultiple> {
  <template>
    <div class="ember-power-select-placeholder">
      This is a very
      <span style="font-weight:bold">
        bold
      </span>
      placeholder
    </div>
  </template>
}
