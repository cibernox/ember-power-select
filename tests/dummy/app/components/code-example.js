import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class CodeExampleComponent extends Component {
  showResult = true;
  @tracked _activeTab = undefined;

  get activeTab() {
    return this._activeTab || (this.showResult ? 'result' : 'js');
  }

  get partialName() {
    return `snippets/${this.args.hbs.replace('.hbs', '')}`;
  }

  @action
  setActiveTab(value) {
    this._activeTab = value;
  }
}
