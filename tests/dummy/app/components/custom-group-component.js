/* eslint-disable ember/classic-decorator-hooks, ember/require-tagless-components */
import Component from '@ember/component';

export default class CustomGroupComponent extends Component {
  init() {
    super.init(...arguments);
    this.onInit?.bind(this)();
  }
}
