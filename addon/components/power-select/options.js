import Component from 'ember-component';
import $ from 'jquery';
import layout from '../../templates/components/power-select/options';
import computed from 'ember-computed';

export default Component.extend({
  isTouchDevice: (!!self.window && 'ontouchstart' in self.window),
  layout: layout,
  tagName: 'ul',
  attributeBindings: ['role', 'aria-controls'],
  role: 'listbox',

  // Lifecycle hooks
  didInsertElement() {
    this._super(...arguments);
    if (this.get('role') === 'group') {
      return;
    }
    let findOptionAndPerform = (action, e) => {
      let optionItem = $(e.target).closest('[data-option-index]');
      if (!optionItem || !(0 in optionItem)) { return; }
      if (optionItem.closest('[aria-disabled=true]').length) { return; } // Abort if the item or an ancestor is disabled
      let optionIndex = optionItem[0].getAttribute('data-option-index');
      action(this._optionFromIndex(optionIndex), e);
    };
    this.element.addEventListener('mouseup', e => findOptionAndPerform(this.get('select.actions.choose'), e));
    this.element.addEventListener('mouseover', e => findOptionAndPerform(this.get('select.actions.highlight'), e));
    if (this.get('isTouchDevice')) {
      this._addTouchEvents();
    }
    if (this.get('role') !== 'group') {
      let select = this.get('select');
      select.actions.scrollTo(select.highlighted);
    }
  },

  // CPs
  'aria-controls': computed('select._id', function() {
    return `ember-power-select-trigger-${this.get('select._id')}`;
  }),

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
	  let optionItem = $(e.target).closest('[data-option-index]');

	  if (!optionItem || !(0 in optionItem)) { return; }

      e.preventDefault();
      if (this.hasMoved) {
        this.hasMoved = false;
        return;
      }

      let optionIndex = optionItem[0].getAttribute('data-option-index');
      this.get('select.actions.choose')(this._optionFromIndex(optionIndex), e);
    });
  },

  _optionFromIndex(index) {
    let parts = index.split('.');
    let options = this.get('options');
    let option = options[parseInt(parts[0], 10)];
    for (let i = 1; i < parts.length; i++) {
      option = option.options[parseInt(parts[i], 10)];
    }
    return option;
  }
});
