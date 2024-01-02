import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class CustomGroupComponent extends Component {
  @action
  setup() {
    this.onInit?.bind(this)();
  }
}
