import { action } from '@ember/object';
import Component from '@glimmer/component';
import type { PowerSelectTriggerSignature } from 'ember-power-select/components/power-select/trigger';
import type { GroupedNumber } from 'test-app/utils/constants';

export default class CustomTriggerWithSearch extends Component<
  PowerSelectTriggerSignature<GroupedNumber>
> {
  @action
  onSearch(evt: Event) {
    this.args.select.actions.search(
      (evt.target as HTMLInputElement).value ?? '',
    );
  }
}
