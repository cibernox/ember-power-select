import Component from '@glimmer/component';

export default class CustomGroupComponent extends Component {
  constructor() {
    super(...arguments);
    this.onInit?.bind(this)();
  }
}
