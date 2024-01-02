import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

const options = [
  ["I'm", 'just', 'a logo'],
  ['I', "don't", 'work'],
  ['Are', 'you', 'serious?'],
  ['La la', 'la la', "I can't hear you!"],
  ['No,', 'really.', 'STOP'],
  ['Enough.', "I'm done", 'with you'],
];

export default class extends Controller {
  @service router;

  mainSelected = 'foo';

  @tracked mainOptionsIndex = 0;

  get mainSelectOptions() {
    return this.mainOptionsIndex < options.length
      ? options[this.mainOptionsIndex]
      : [];
  }

  get disabled() {
    return (
      this.router.currentRouteName !== 'public-pages.index' ||
      this.mainOptionsIndex >= options.length
    );
  }

  @action
  changeOptions() {
    this.mainOptionsIndex++;
  }
}
