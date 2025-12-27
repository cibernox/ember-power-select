import Component from '@glimmer/component';
import { guidFor } from '@ember/object/internals';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';

class PowerSelectPowerSelectGroupComponent extends Component {
  static {
    setComponentTemplate(precompileTemplate("\n    <li class=\"ember-power-select-group\" aria-disabled={{if @group.disabled \"true\"}} role=\"group\" aria-labelledby={{this.uniqueId}}>\n      <span class=\"ember-power-select-group-name\" id={{this.uniqueId}}>{{@group.groupName}}</span>\n      {{yield}}\n    </li>\n  ", {
      strictMode: true
    }), this);
  }
  uniqueId = guidFor(this);
  get disabled() {
    return this.args.group.disabled;
  }
}

export { PowerSelectPowerSelectGroupComponent as default };
//# sourceMappingURL=power-select-group.js.map
