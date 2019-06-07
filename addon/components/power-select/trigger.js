import { layout, tagName } from "@ember-decorators/component";
import Component from '@ember/component';
import { action } from "@ember/object";
import templateLayout from '../../templates/components/power-select/trigger';

export default @tagName('') @layout(templateLayout) class Trigger extends Component {
  @action
  clear(e) {
    e.stopPropagation();
    this.select.actions.select(null);
    if (e.type === 'touchstart') {
      return false;
    }
  }
}
