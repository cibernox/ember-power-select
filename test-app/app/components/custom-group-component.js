import Component from '@glimmer/component';
import { modifier } from 'ember-modifier';

export default class CustomGroupComponent extends Component {
  didSetup = false;

  setup = modifier(() => {
    if (this.didSetup) {
      return;
    }

    this.didSetup = true;
    this.onInit?.bind(this)();
  });
}
