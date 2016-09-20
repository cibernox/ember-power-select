import Ember from 'ember';
import OptionsComponent from 'ember-power-select/components/power-select/options';

export default OptionsComponent.extend({
  animationRules: Ember.computed(function() {
    return function() {
      this.transition(
        this.toValue(function(newOptions, oldOptions) {
          return oldOptions === safeGet(newOptions, 0, 'parentLevel', 'options');
        }),
        this.use('toLeft'),
        this.reverse('toRight')
      );
    };
  }),

  didReceiveAttrs() {
    this._super(...arguments);
    this.set('enableGrowth', !this.get('options.fromSearch'));
  }
});

function safeGet(base, ...keys) {
  while (base && keys.length > 0) {
    base = base[keys.shift()];
  }
  return base;
}
