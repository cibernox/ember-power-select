import Component from '@glimmer/component';

export default class extends Component {
  names = ['Stefan', 'Miguel', 'Tomster', 'Pluto'];
  name = this.names[3];
}
