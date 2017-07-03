import Controller from '@ember/controller';

const numbers = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

export default Controller.extend({
  numbers,
  actions: {
    verifyPresence(select /*, e */) {
      if (this.get('mandatoryNumber')) {
        this.set('selectClass', null);
      } else {
        this.set('selectClass', 'has-error');
        return false;
      }
    }
  }
});
