import Controller from '@ember/controller';
import { computed, action } from '@ember/object';
import { inject as service } from '@ember/service';

const options = [
  ['I\'m', 'just', 'a logo'],
  ['I', 'don\'t', 'work'],
  ['Are', 'you', 'serious?'],
  ['La la', 'la la', 'I can\'t hear you!'],
  ['No,', 'really.', 'STOP'],
  ['Enough.', 'I\'m done', 'with you']
];

export default class extends Controller {
  @service router
  mainSelectOptions = options[0]
  mainSelected = 'foo'

  @computed('router.currentRouteName')
  get disabled() {
    return this.router.currentRouteName !== 'public-pages.index';
  }
  set disabled(v) {
    return v;
  }

  @action
  changeOptions() {
    let index = options.indexOf(this.mainSelectOptions) + 1;
    if (index === options.length) {
      this.set('disabled', true);
    } else {
      this.set('mainSelectOptions', options[index]);
    }
  }
}
