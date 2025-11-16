import Component from '@glimmer/component';
import { action } from '@ember/object';
import { precompileTemplate } from '@ember/template-compilation';
import { n } from 'decorator-transforms/runtime';
import { setComponentTemplate } from '@ember/component';

var TEMPLATE = precompileTemplate("{{#let\n  (or @labelTag \"label\") (element (or @labelTag \"label\"))\n  as |tagName LabelTag|\n}}\n  <LabelTag\n    id={{@labelId}}\n    class=\"ember-power-select-label\"\n    ...attributes\n    for={{if (eq tagName \"label\") @triggerId}}\n    {{on \"click\" this.onLabelClick}}\n  >\n    {{@labelText}}\n  </LabelTag>\n{{/let}}");

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
