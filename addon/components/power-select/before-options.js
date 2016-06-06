import Component from 'ember-component';
import { scheduleOnce } from 'ember-runloop';
import layout from '../../templates/components/power-select/before-options';

export default Component.extend({
  tagName: '',
  layout,

  // Lifecycle hooks
  didInsertElement() {
    this._super(...arguments);
    this.focusInput();
    // this.get('eventSender').on('focus', this, this.focusInput);
  },

  willDestroyElement() {
    this._super(...arguments);
    if (this.getAttr('searchEnabled')) {
      this.getAttr('select').actions.search('');
    }
    // this.get('eventSender').off('focus', this, this.focusInput);
  },

  // Actions
  actions: {
    onKeydown(e) {
      let select = this.get('select');
      if (e.keyCode === 13) {
        let onkeydown = this.get('onkeydown');
        if (onkeydown) { onkeydown(select, e); }
        if (e.defaultPrevented) { return; }
        select.actions.choose(select.highlighted, e);
      } else if (e.keyCode === 32) {
        // noop
      } else {
        this.getAttr('onKeydown')(e);
      }
    }
  },

  // Methods
  focusInput() {
    this.input = self.document.querySelector('.ember-power-select-search-input');
    if (this.input) {
      scheduleOnce('afterRender', this.input, 'focus');
    }
  }
});
