import Component from '@glimmer/component';
import { action } from '@ember/object';
import { precompileTemplate } from '@ember/template-compilation';
import { n } from 'decorator-transforms/runtime';
import { setComponentTemplate } from '@ember/component';

var TEMPLATE = precompileTemplate("<label id={{@labelId}} class=\"ember-power-select-label\" ...attributes for={{@triggerId}} {{on \"click\" this.onLabelClick}}>\n  {{@labelText}}\n</label>");

class PowerSelectLabelComponent extends Component {
  onLabelClick(e) {
    if (!this.args.select) {
      return;
    }
    this.args.select.actions.labelClick(e);
  }
  static {
    n(this.prototype, "onLabelClick", [action]);
  }
}
setComponentTemplate(TEMPLATE, PowerSelectLabelComponent);

export { PowerSelectLabelComponent as default };
//# sourceMappingURL=label.js.map
