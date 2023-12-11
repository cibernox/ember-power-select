import Controller from '@ember/controller';
import { action } from '@ember/object';
import { lte } from '@ember/object/computed';
import { A } from '@ember/array';
import { later } from '@ember/runloop';
import ActionHandling1 from '../../../components/snippets/action-handling-1';
import ActionHandling2 from '../../../components/snippets/action-handling-2';
import ActionHandling3 from '../../../components/snippets/action-handling-3';
import ActionHandling4 from '../../../components/snippets/action-handling-4';
import ActionHandling5 from '../../../components/snippets/action-handling-5';
import ActionHandling6 from '../../../components/snippets/action-handling-6';
import ActionHandling7 from '../../../components/snippets/action-handling-7';

const numbers = [
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
];

export default class extends Controller {
  actionHandling1 = ActionHandling1;
  actionHandling2 = ActionHandling2;
  actionHandling3 = ActionHandling3;
  actionHandling4 = ActionHandling4;
  actionHandling5 = ActionHandling5;
  actionHandling6 = ActionHandling6;
  actionHandling7 = ActionHandling7;
  cities = [
    'Barcelona',
    'London',
    'New York',
    'Porto',
    'Coruña',
    'Kracow',
    'Siena',
    'Portland',
    'Springfield',
    'Tokio',
  ];
  destination = 'London';
  selectedCities = A();
  numbers = numbers;
  counter = 8;
  @lte('counter', 0) destroyed;

  @action
  chooseDestination(city) {
    this.set('destination', city);
  }

  @action
  handleKeydown(dropdown, e) {
    if (e.keyCode !== 13) {
      return;
    }
    let text = e.target.value;
    if (text.length > 0 && this.cities.indexOf(text) === -1) {
      this.set('selectedCities', this.selectedCities.concat([text]));
    }
  }

  handleFocus(select, e) {
    /* eslint-disable */
    console.debug('EPS focused!');
    /* eslint-enable */
    let blurredEl = e.relatedTarget;
    if (
      !blurredEl ||
      !blurredEl.classList.contains('ember-power-select-search-input')
    ) {
      select.actions.open();
    }
  }

  handleBlur() {
    /* eslint-disable */
    console.debug('EPS blurred!');
    /* eslint-enable */
  }

  @action
  startSelfDestroyCountdown() {
    let tick = () => {
      this.decrementProperty('counter');
      if (!this.destroyed) {
        later(tick, 1000);
      }
    };
    this.set('countdown', later(tick, 1000));
  }

  @action
  verifyPresence(/* select, e */) {
    if (this.mandatoryNumber) {
      this.set('selectClass', null);
    } else {
      this.set('selectClass', 'has-error');
      return false;
    }
  }

  checkLength(text, select) {
    if (select.searchText.length >= 3 && text.length < 3) {
      return '';
    } else {
      return text.length >= 3;
    }
  }
}
