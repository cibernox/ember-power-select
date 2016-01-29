import Ember from 'ember';
import layout from '../../templates/components/power-select/before-options';
import updateInput from '../../utils/update-input-value';

const { run } = Ember;

export default Ember.Component.extend({
  tagName: '',
  layout,

  // Lifecycle hooks
  didReceiveAttrs({ oldAttrs, newAttrs }) {
    this._super(...arguments);
    if (!oldAttrs || newAttrs.searchText !== oldAttrs.searchText) {
      run.scheduleOnce('afterRender', this, this.updateInput, oldAttrs && oldAttrs.searchText, newAttrs.searchText);
    }
  },

  didInsertElement() {
    this._super(...arguments);
    this.input = document.querySelector('.ember-power-select-search input');
    if (this.input) {
      Ember.run.schedule('afterRender', this.input, 'focus');
    }
  },

  willDestroy() {
    this._super(...arguments);
    if (this.get('searchEnabled')) {
      this.get('select.actions.search')('');
    }
  },

  // Actions
  actions: {
    handleKeydown(e) {
      const select = this.get('select');
      if (e.keyCode === 13) {
        const onkeydown = this.get('onkeydown');
        if (onkeydown) { onkeydown(select, e); }
        if (e.defaultPrevented) { return; }
        select.actions.choose(this.get('highlighted'), e);
      } else {
        select.actions.handleKeydown(e);
      }
    }
  },

  // Methods
  updateInput(oldText, newText) {
    updateInput(this.input, oldText, newText);
  }
});
