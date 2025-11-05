import Component from '@glimmer/component';
import { action } from '@ember/object';
import PowerSelect from 'ember-power-select/components/power-select';
import { fn } from '@ember/helper';
import { tracked } from '@glimmer/tracking';
import type { Select } from 'ember-power-select/types';

export default class extends Component {
  @tracked selected: string[] = [];

  cities: string[] = ['Barcelona', 'London', 'New York', 'Porto'];

  @action
  handleFocus(select: Select<string, true>, e: FocusEvent) {
    console.debug('EPS focused!');
    if (this.focusComesFromOutside(e)) {
      select.actions.open();
    }
  }

  @action
  handleBlur() {
    console.debug('EPS blurred!');
  }

  // Methods
  focusComesFromOutside(e: FocusEvent) {
    const blurredEl = e.relatedTarget as HTMLElement | null;
    if (!blurredEl) {
      return false;
    }
    return !blurredEl.classList.contains('ember-power-select-search-input');
  }

  <template>
    <input
      type="text"
      placeholder="Focus me and press TAB to focus the select"
      style="line-height: 2; width: 100%"
    />
    <br />
    <br />
    <PowerSelect
      @multiple={{true}}
      @selected={{this.selected}}
      @options={{this.cities}}
      @onChange={{fn (mut this.selected)}}
      @onFocus={{this.handleFocus}}
      @labelText="Country"
      @onBlur={{this.handleBlur}}
      as |name|
    >
      {{name}}
    </PowerSelect>
  </template>
}
