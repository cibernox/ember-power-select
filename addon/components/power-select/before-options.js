import Ember from 'ember';
import Component from 'ember-component';
import { scheduleOnce } from 'ember-runloop';
import layout from '../../templates/components/power-select/before-options';

export default Component.extend({
  tagName: '',
  layout,
  autofocus: true,

  // Lifecycle hooks
  didInsertElement() {
    this._super(...arguments);

    if (this.get('autofocus')) {
      this.focusInput();
    }
  },

  willDestroyElement() {
    this._super(...arguments);
    if (this.get('searchEnabled')) {
      scheduleOnce('actions', this, this.get('select').actions.search, '');
    }
  },

  // Actions
  actions: {
    onKeydown(e) {
      let onKeydown = this.get('onKeydown');
      if (onKeydown(e) === false) {
        return false;
      }
      if (e.keyCode === 13) {
        let select = this.get('select');
        select.actions.close(e);
      }
    }
  },

  // Methods
  focusInput() {
    const parentElement = Ember.get(this, 'parentView.element');

    if (parentElement) {
      this.input = parentElement.querySelector('.ember-power-select-search-input');
    }
    if (this.input) {
      scheduleOnce('afterRender', this.input, 'focus');
    }
  }
});
