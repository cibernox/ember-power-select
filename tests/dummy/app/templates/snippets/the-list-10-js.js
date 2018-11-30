import Controller from '@ember/controller';

export default Controller.extend({
  names: ['Stefan', 'Miguel', 'Tomster', 'Pluto'],
  actions: {
    stopPropagation(e) {
      e.stopPropagation();
    },
    removeName(name) {
      alert(`remove name: ${name}`);
    }
  }
});
