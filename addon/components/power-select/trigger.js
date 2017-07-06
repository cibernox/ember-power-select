import Component from '@ember/component';
import layout from '../../templates/components/power-select/trigger';

export default Component.extend({
  layout,
  tagName: '',

  // Actions
  actions: {
    clear(e) {
      e.stopPropagation();
      this.get('select').actions.select(null);
      if (e.type === 'touchstart') {
        return false;
      }
    }
  }
});
