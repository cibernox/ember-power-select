import Ember from 'ember';

export default Ember.Component.extend({
  didReceiveAttrs({ oldAttrs, newAttrs }) {
    this._super(...arguments);
    if (!oldAttrs || !oldAttrs.options || !newAttrs.options || oldAttrs.options === newAttrs.options) {
      return;
    }
    if (newAttrs.options.fromSearch) {
      this.set('animation', false);
      this.set('enableGrowth', false);
    } else {
      this.set('enableGrowth', true);
      const parentLevel = oldAttrs.options[0] && oldAttrs.options[0].parentLevel
      const goingBack = !!parentLevel && parentLevel.options === newAttrs.options;
      if (goingBack) {
        this.set('animation', 'toRight');
      } else {
        this.set('animation', 'toLeft');
      }
    }
  }
});