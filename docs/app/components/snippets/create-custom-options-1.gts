import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import PowerSelect, {
  type Select,
} from 'ember-power-select/components/power-select';
import { fn } from '@ember/helper';

export default class extends Component {
  @tracked options: string[] = ['Barcelona', 'London', 'New York', 'Porto'];

  selected: string[] = [];

  @action
  createOnEnter(select: Select, e: KeyboardEvent) {
    if (
      e.keyCode === 13 &&
      select.isOpen &&
      !select.highlighted &&
      select.searchText
    ) {
      if (!this.selected.includes(select.searchText)) {
        this.options = [...this.options, select.searchText];
        select.actions.choose(select.searchText);
      }
    }
  }

  <template>
    <PowerSelect
      @multiple={{true}}
      @options={{this.options}}
      @selected={{this.selected}}
      @onChange={{fn (mut this.selected)}}
      @searchEnabled={{true}}
      @labelText="Country"
      @onKeydown={{this.createOnEnter}}
      as |number|
    >
      {{number}}
    </PowerSelect>
  </template>
}
