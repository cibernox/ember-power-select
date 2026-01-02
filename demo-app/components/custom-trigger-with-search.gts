import { action } from '@ember/object';
import Component from '@glimmer/component';
import { on } from '@ember/modifier';
import type { PowerSelectTriggerSignature } from '#src/components/power-select/trigger.gts';

export default class CustomTriggerWithSearch extends Component<
  PowerSelectTriggerSignature<string>
> {
  <template>
    {{! template-lint-disable require-input-label }}
    <input
      type="search"
      tabindex="0"
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck={{false}}
      aria-controls={{@listboxId}}
      {{on "input" this.onSearch}}
    />
  </template>
  @action
  onSearch(evt: Event) {
    this.args.select.actions.search(
      (evt.target as HTMLInputElement).value ?? '',
    );
  }
}
