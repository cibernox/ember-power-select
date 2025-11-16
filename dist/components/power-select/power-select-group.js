import Component from '@glimmer/component';
import { guidFor } from '@ember/object/internals';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';

var TEMPLATE = precompileTemplate("<li\n  class=\"ember-power-select-group\"\n  aria-disabled={{if @group.disabled \"true\"}}\n  role=\"group\"\n  aria-labelledby={{this.uniqueId}}\n>\n  <span\n    class=\"ember-power-select-group-name\"\n    id={{this.uniqueId}}\n  >{{@group.groupName}}</span>\n  {{yield}}\n</li>");

class PowerSelectGroupComponent extends Component {
  uniqueId = guidFor(this);
}
setComponentTemplate(TEMPLATE, PowerSelectGroupComponent);

export { PowerSelectGroupComponent as default };
//# sourceMappingURL=power-select-group.js.map
