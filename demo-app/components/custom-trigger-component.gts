import PowerSelectTrigger from '#src/components/power-select/trigger.gts';

export default class CustomTrigger<
  T,
  TExtra = undefined,
> extends PowerSelectTrigger<T, TExtra> {
  <template>
    <div class="custom-trigger-component">{{@loadingMessage}}</div>
  </template>
}
