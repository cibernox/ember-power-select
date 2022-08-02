import Component from '@ember/component';

export default class CustomGroupComponent extends Component {
  init(){
    super.init(...arguments);
    this.onInit?.bind(this)();
  }
}
