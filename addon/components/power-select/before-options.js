import Ember from 'ember';
import layout from '../../templates/components/power-select/before-options';

export default Ember.Component.extend({
  tagName: '',
  layout,

  // Actions
  actions: {
    handleKeydown(e) {
      if (e.keyCode === 13) {
        const { select, onkeydown, closeOnSelect } = this.getProperties('select', 'onkeydown', 'closeOnSelect');
        if (onkeydown) { onkeydown(select, e); }
        if (e.defaultPrevented) { return; }
        this.get('select.actions.select')(this.get('highlighted'), e);
        if (closeOnSelect) { this.get('select.actions.close')(e); }
      } else {
        this.get('select.actions.handleKeydown')(e);
      }
    }
  }
});
