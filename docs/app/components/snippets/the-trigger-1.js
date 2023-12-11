import Component from '@glimmer/component';

export default class extends Component {
  names = ['Stefan', 'Miguel', 'Tomster', 'Pluto'];
  name = 'Pluto';
  destination = this.names[2];
}
