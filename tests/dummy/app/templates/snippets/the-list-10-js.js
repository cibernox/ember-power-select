import Controller from '@ember/controller';

export default class extends Controller{
  names = ['Stefan', 'Miguel', 'Tomster', 'Pluto']

  stopPropagation(e) {
    e.stopPropagation();
  }

  removeName(name) {
    alert(`remove name: ${name}`);
  }
}
