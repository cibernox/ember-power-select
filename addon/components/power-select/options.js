import Ember from 'ember';
import layout from '../../templates/components/power-select/options';

export default Ember.Component.extend({
  isTouchDevice: (!!self.window && 'ontouchstart' in self.window),
  layout: layout,
  tagName: 'ul',
  attributeBindings: ['role', 'aria-controls'],
  role: 'listbox',

  // Lifecycle hooks
  didInsertElement() {
    this._super(...arguments);
    if (this.get('role') === 'group') { return; }
    let findOptionAndPerform = (action, e) => {
      let optionItem = Ember.$(e.target).closest('[data-option-index]');
      if (!optionItem || !(0 in optionItem)) { return; }
      action(this._optionFromIndex(optionItem[0].dataset.optionIndex), e);
    };
    this.element.addEventListener('mouseup', e => findOptionAndPerform(this.get('select.actions.choose'), e));
    this.element.addEventListener('mouseover', e => findOptionAndPerform(this.get('select.actions.highlight'), e));
    if (this.get('isTouchDevice')) {
      this._addTouchEvents();
    }
  },

  // Methods
  _addTouchEvents() {
    let touchMoveHandler = () => {
      this.hasMoved = true;
      this.element.removeEventListener('touchmove', touchMoveHandler);
    };
    // Add touch event handlers to detect taps
    this.element.addEventListener('touchstart', () => {
      this.element.addEventListener('touchmove', touchMoveHandler);
    });
    this.element.addEventListener('touchend', e => {
      e.preventDefault();
      if (this.hasMoved) {
        this.hasMoved = false;
        return;
      }
      if (e.target.dataset.optionIndex) {
        this.get('select.actions.choose')(this._optionFromIndex(e.target.dataset.optionIndex), e);
      }
    });
  },

  _optionFromIndex(index) {
    let parts = index.split('.');
    let options = this.get('options');
    if (!options.objectAt) {
      options = Ember.A(options);
    }
    let option = options.objectAt(parseInt(parts[0], 10));
    for (let i = 1; i < parts.length; i++) {
      let groupOptions = option.options;
      if (!groupOptions.objectAt) {
        groupOptions = Ember.A(groupOptions);
      }
      option = groupOptions.objectAt(parseInt(parts[i], 10));
    }
    return option;
  }
});
