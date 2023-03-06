import Component from '@glimmer/component';

export default class extends Component {
  names = ['Stefan', 'Miguel', 'Tomster', 'Pluto'];

  stopPropagation(e) {
    e.stopPropagation();
  }

  removeName(name) {
    alert(`remove name: ${name}`);
  }
}
