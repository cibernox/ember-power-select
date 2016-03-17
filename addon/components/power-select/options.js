import Ember from 'ember';
import layout from '../../templates/components/power-select/options';

export default Ember.Component.extend({
  layout: layout,
  tagName: 'ul',
  attributeBindings: ['role', 'aria-controls'],
  role: 'listbox',

  init() {
    this._super(...arguments);
    this._touchMoveHandler = this._touchMoveHandler.bind(this);
  },

  // Actions
  actions: {
    handleTouchStart(e) {
      e.preventDefault();
      this.element.addEventListener('touchmove', this._touchMoveHandler);
    },

    handleTouchEnd(option, e) {
      if (this.hasMoved) {
        this.hasMoved = false;
        return;
      }
      this.get('select.actions.choose')(option, e);
    }
  },

  // Methods
  _touchMoveHandler() {
    this.hasMoved = true;
    this.element.removeEventListener('touchmove', this._touchMoveHandler);
  }
});
