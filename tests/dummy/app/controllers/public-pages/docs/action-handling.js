import Controller from '@ember/controller';
import { lte } from '@ember/object/computed';
import { A } from '@ember/array';
import { later } from '@ember/runloop';

const numbers = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

export default Controller.extend({
  cities: ['Barcelona', 'London', 'New York', 'Porto', 'Coruña', 'Kracow', 'Siena', 'Portland', 'Springfield', 'Tokio'],
  destination: 'London',
  selectedCities: A(),
  numbers,
  counter: 8,
  destroyed: lte('counter', 0),

  actions: {
    chooseDestination(city) {
      this.set('destination', city);
    },

    handleKeydown(dropdown, e) {
      if (e.keyCode !== 13) {
        return;
      }
      let text = e.target.value;
      if (text.length > 0 && this.get('cities').indexOf(text) === -1) {
        let cities = this.get('selectedCities');
        this.set('selectedCities', cities.concat([text]));
      }
    },

    handleFocus(select, e) {
      /* eslint-disable */
      console.debug('EPS focused!');
      /* eslint-enable */
      let blurredEl = e.relatedTarget;
      if (!blurredEl || !blurredEl.classList.contains('ember-power-select-search-input')) {
        select.actions.open();
      }
    },

    handleBlur() {
      /* eslint-disable */
      console.debug('EPS blurred!');
      /* eslint-enable */
    },

    startSelfDestroyCountdown() {
      let tick = () => {
        this.decrementProperty('counter');
        if (!this.get('destroyed')) {
          later(tick, 1000);
        }
      };
      this.set('countdown', later(tick, 1000));
    },

    verifyPresence(/* select, e */) {
      if (this.get('mandatoryNumber')) {
        this.set('selectClass', null);
      } else {
        this.set('selectClass', 'has-error');
        return false;
      }
    },

    checkLength(text, select) {
      if (select.searchText.length >= 3 && text.length < 3) {
        return '';
      } else {
        return text.length >= 3;
      }
    }
  }
});
