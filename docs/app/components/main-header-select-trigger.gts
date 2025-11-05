import { LinkTo } from '@ember/routing';
import type { TOC } from '@ember/component/template-only';
import type { PowerSelectTriggerSignature } from 'ember-power-select/components/power-select/trigger';

export interface MainHeaderSelectTriggerSignature<
  T,
  TExtra = unknown,
  IsMultiple extends boolean = false,
> extends Omit<PowerSelectTriggerSignature<T, TExtra, IsMultiple>, 'Args'> {
  Args: PowerSelectTriggerSignature<T, TExtra, IsMultiple>['Args'] & {
    disabled: boolean;
  };
}

export default <template>
  {{#if @disabled}}
    <LinkTo @route="public-pages.index">
      <strong>Power</strong>
      Select
      <div class="ember-power-select-status-icon"></div>
    </LinkTo>
  {{else}}
    <strong>Power</strong>
    Select
    <div class="ember-power-select-status-icon"></div>
  {{/if}}
</template> satisfies TOC<MainHeaderSelectTriggerSignature<string>>;
