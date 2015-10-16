import Ember from 'ember';

const options = [
  ['I\'m', 'just', 'a logo'],
  ['I', 'don\'t', 'work'],
  ['Are', 'you', 'serius?'],
  ['No', 'really.', 'Stop'],
  ['La la', 'la la', 'I don\'t hear you!'],
  ['Ok', 'I\'m done', 'with you']
];

export default Ember.Controller.extend({
  mainSelectOptions: options[0],
  mainSelected: 'foo',

  actions: {
    changeOptions() {
      const index = options.indexOf(this.get('mainSelectOptions')) + 1;
      if (index === options.length) {
        this.set('disabled', true);
      } else {
        this.set('mainSelectOptions', options[index]);
      }
    }
  }
});
