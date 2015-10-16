import Ember from 'ember';

const options = [
  ['I\'m', 'just', 'a logo'],
  ['I', 'don\'t', 'work'],
  ['Are', 'you', 'serious?'],
  ['La la', 'la la', 'I don\'t hear you!'],
  ['No,', 'really.', 'STOP'],
  ['Enough.', 'I\'m done', 'with you']
];

export default Ember.Controller.extend({
  mainSelectOptions: options[0],
  mainSelected: 'foo',
  disabled: Ember.computed('currentPath', function() {
    return this.get('currentPath') !== 'index';
  }),

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
