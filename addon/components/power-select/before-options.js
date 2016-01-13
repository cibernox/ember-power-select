import Ember from 'ember';
import layout from '../../templates/components/power-select/before-options';

export default Ember.Component.extend({
  tagName: '',
  layout,

  // Lifecycle hooks
  didInsertElement() {
    this._super(...arguments);
    Ember.run.schedule('afterRender', () => Ember.$('.ember-power-select-search input').focus());
  },

  // Actions
  actions: {
    handleKeydown(e) {
      if (e.keyCode === 13) {
        const { select, onkeydown } = this.getProperties('select', 'onkeydown');
        if (onkeydown) { onkeydown(select, e); }
        if (e.defaultPrevented) { return; }
        this.get('select.actions.choose')(this.get('highlighted'), e);
      } else {
        this.get('select.actions.handleKeydown')(e);
      }
    }
  }
});
