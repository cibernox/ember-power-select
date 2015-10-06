import Ember from 'ember';
import layout from '../templates/components/ember-dropdown';

const { Component, run, computed } = Ember;

export default Component.extend({
  layout: layout,
  renderInPlace: false,
  dropdownPosition: 'auto', // auto | above | below
  classNames: ['ember-power-select'],
  classNameBindings: ['_opened:opened', 'renderInPlace', '_dropdownPositionClass'],
  _wormholeDestination: (Ember.testing ? 'ember-testing' : 'ember-power-select-wormhole'),

  // Lifecycle hooks
  init() {
    this._super(...arguments);
    const rootSelector = Ember.testing ? '#ember-testing' : this.container.lookup('application:main').rootElement;
    this.appRoot = document.querySelector(rootSelector);
    this.handleRootClick = this.handleRootClick.bind(this);
    this.handleRepositioningEvent = this.handleRepositioningEvent.bind(this);
  },

  // CPs
  tabindex: computed('disabled', function() {
    return !this.get('disabled') ? "0" : "-1";
  }),

  // Actions
  actions: {
    toggle(e) {
      this.toggle(e);
    },

    keydown(e) {
      this.handleKeydown(e);
    }
  },

  // Methods
  toggle(e) {
    if (this.get('_opened')) {
      this.close(e);
    } else {
      this.open(e);
    }
  },

  open(e) {
    this.set('_opened', true);
    this.addGlobalEvents();
    run.scheduleOnce('afterRender', this, this.repositionDropdown);
  },

  close(e) {
    this.set('_opened', false);
    this.removeGlobalEvents();
  },

  handleKeydown(e) {
    if (this.get('disabled')) { return; }
    if (e.keyCode === 13) {  // Enter
      this.toggle(e);
    }
  },

  repositionDropdown() {
    // debugger;
    if (this.get('renderInPlace')) { return; }
    const dropdownPositionStrategy = this.get('dropdownPosition');
    const dropdown = this.appRoot.querySelector('.ember-dropdown-content');
    const width = this.element.offsetWidth;
    let left = this.element.offsetLeft;
    dropdown.style.width = `${width}px`;
    let top;
    if (dropdownPositionStrategy === 'above') {
      top = this.element.offsetTop - dropdown.offsetHeight;
    } else if (dropdownPositionStrategy === 'below') {
      top = this.element.offsetTop + this.element.offsetHeight;
    } else { // auto
      const viewportTop = document.body.scrollTop;
      const viewportBottom = window.scrollY + window.innerHeight;
      const dropdownHeight = dropdown.offsetHeight;
      const selectTop = this.element.offsetTop;
      const enoughRoomBelow = selectTop + this.element.offsetHeight + dropdownHeight < viewportBottom;
      const enoughRoomAbove = selectTop - viewportTop > dropdownHeight;
      let positionClass = this.get('_dropdownPositionClass');
      if (positionClass === 'below' && !enoughRoomBelow && enoughRoomAbove) {
        positionClass = this.set('_dropdownPositionClass', 'above');
      } else if (positionClass === 'above' && !enoughRoomAbove && enoughRoomBelow) {
        positionClass = this.set('_dropdownPositionClass', 'below');
      } else if (!positionClass) {
        positionClass = this.set('_dropdownPositionClass', enoughRoomBelow ? 'below' : 'above');
      }
      top = selectTop + (positionClass === 'below' ? this.element.offsetHeight : -dropdownHeight);
    }
    dropdown.style.top = `${top}px`;
    dropdown.style.left = `${left}px`;
  },

  handleRootClick(e) {
    if (!this.element.contains(e.target) && !this.appRoot.querySelector('.ember-dropdown-content').contains(e.target)) {
      this.close();
    }
  },

  handleRepositioningEvent(/* e */) {
    run.throttle(this, 'repositionDropdown', 60, true);
  },

  addGlobalEvents() {
    this.appRoot.addEventListener('click', this.handleRootClick);
    window.addEventListener('scroll', this.handleRepositioningEvent);
    window.addEventListener('resize', this.handleRepositioningEvent);
    window.addEventListener('orientationchange', this.handleRepositioningEvent);
  },

  removeGlobalEvents() {
    this.appRoot.removeEventListener('click', this.handleRootClick);
    window.removeEventListener('scroll', this.handleRepositioningEvent);
    window.removeEventListener('resize', this.handleRepositioningEvent);
    window.removeEventListener('orientationchange', this.handleRepositioningEvent);
  }
});