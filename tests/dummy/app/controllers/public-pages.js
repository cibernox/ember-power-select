import Ember from 'ember';

const options = [
  ['I\'m', 'just', 'a logo'],
  ['I', 'don\'t', 'work'],
  ['Are', 'you', 'serious?'],
  ['La la', 'la la', 'I can\'t hear you!'],
  ['No,', 'really.', 'STOP'],
  ['Enough.', 'I\'m done', 'with you']
];

export default Ember.Controller.extend({
  applicationController: Ember.inject.controller('application'),
  mainSelectOptions: options[0],
  mainSelected: 'foo',
  disabled: Ember.computed('applicationController.currentPath', function() {
    return this.get('applicationController.currentPath') !== 'public-pages.index';
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
