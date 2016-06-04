import Ember from 'ember';
import layout from '../../templates/components/power-select/before-options';

const { run } = Ember;

export default Ember.Component.extend({
  tagName: '',
  layout,

  // Lifecycle hooks
  didInsertElement() {
    this._super(...arguments);
    this.focusInput();
    // this.get('eventSender').on('focus', this, this.focusInput);
  },

  willDestroy() {
    this._super(...arguments);
    if (this.get('searchEnabled')) {
      this.get('select.actions.search')('');
    }
    // this.get('eventSender').off('focus', this, this.focusInput);
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
      } else if (e.keyCode === 32) {
        // noop
      } else {
        select.actions.handleKeydown(e);
      }
    }
  },

  // Methods
  focusInput() {
    this.input = self.document.querySelector('.ember-power-select-search-input');
    if (this.input) {
      run.scheduleOnce('afterRender', this.input, 'focus');
    }
  }
});
