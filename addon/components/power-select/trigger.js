import Component from 'ember-component';
import layout from '../../templates/components/power-select/trigger';
import { and, not } from 'ember-computed';

export default Component.extend({
  layout,
  tagName: '',

  _selectEnabled: not('select.disabled'),
  _allowClearAndSelectEnabled: and('allowClear', '_selectEnabled'),

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
