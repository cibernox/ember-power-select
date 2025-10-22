import Component from '@glimmer/component';
import PowerSelect from 'ember-power-select/components/power-select';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import RSVP from 'rsvp';
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';

function generatePromise(): Promise<string[]> {
  return new RSVP.Promise((resolve) => {
    setTimeout(() => resolve(['one', 'two', 'three']), 5000);
  });
}

export default class extends Component {
  @tracked promise: Promise<string[]> | string[] = [];
  @tracked selected: string | undefined;

  @action
  refreshCollection() {
    this.promise = generatePromise();
  }

  <template>
    <button type="button" {{on "click" this.refreshCollection}}>Refresh
      collection</button>
    <br />
    <PowerSelect
      @options={{this.promise}}
      @selected={{this.selected}}
      @labelText="Default loading message"
      @onChange={{fn (mut this.selected)}}
      as |name|
    >
      {{name}}
    </PowerSelect>
    <br />
    <PowerSelect
      @options={{this.promise}}
      @loadingMessage="Waiting for the server...."
      @selected={{this.selected}}
      @labelText="Custom loading message"
      @onChange={{fn (mut this.selected)}}
      as |name|
    >
      {{name}}
    </PowerSelect>
    (press the
    <code>Refresh Collection</code>
    button and open this select)
  </template>
}
