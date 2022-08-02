import OptionsComponent from 'ember-power-select/components/power-select/options';
import { computed } from '@ember/object';

export default class extends OptionsComponent {
  @computed
  get animationRules() {
    return function () {
      this.transition(
        this.toValue(function (newOptions, oldOptions) {
          return (
            oldOptions === safeGet(newOptions, 0, 'parentLevel', 'options')
          );
        }),
        this.use('toLeft'),
        this.reverse('toRight')
      );
    };
  }

  didReceiveAttrs() {
    super.didReceiveAttrs(...arguments);
    this.set('enableGrowth', !this.options.fromSearch);
  }
}

function safeGet(base, ...keys) {
  while (base && keys.length > 0) {
    base = base[keys.shift()];
  }
  return base;
}
