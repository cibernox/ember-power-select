import Ember from 'ember';
import layout from '../../templates/components/power-select/before-options';

const { run, isBlank } = Ember;

export default Ember.Component.extend({
  tagName: '',
  layout,

  // Lifecycle hooks
  didUpdateAttrs({ oldAttrs, newAttrs }) {
    this._super(...arguments);
    if (newAttrs.searchText !== oldAttrs.searchText) {
      run.scheduleOnce('afterRender', this, this.updateInput, oldAttrs.searchText, newAttrs.searchText);
    }
  },

  didInsertElement() {
    this._super(...arguments);
    Ember.run.schedule('afterRender', () => Ember.$('.ember-power-select-search input').focus());
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
    if (!this.input) { return; }
    if (isBlank(oldText)) {
      this.input.value = newText;
    } else {
      let { selectionStart, selectionEnd } = this.input;
      this.input.value = newText;
      this.input.selectionStart = selectionStart;
      this.input.selectionEnd = selectionEnd;
    }
  }
});
