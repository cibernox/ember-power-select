import Ember from 'ember';

const { get, computed } = Ember;

export default Ember.Component.extend({
  classNames: ['navigable-option-groups'],

  // Lifecycle hooks
  init() {
    this._super(...arguments);
    this.breadcrumbs = Ember.A();
  },

  didInitAttrs({ attrs: { options } }) {
    this._super(...arguments);
    this.set('level', { name: '__root__', options: options.value });
  },

  // CPs
  parentLevel: computed.alias('breadcrumbs.lastObject'),
  parentLevelHighlighted: computed('parentLevel', 'highlightedLevel', function() {
    return this.get('parentLevel') === this.get('highlightedLevel');
  }),

  // Actions
  actions: {
    show(level) {
      const parentLevel = this.get('parentLevel');
      if (level === parentLevel) {
        this.set('animation', 'toRight');
        this.breadcrumbs.popObject();
      } else {
        this.set('animation', 'toLeft');
        this.breadcrumbs.pushObject(this.get('level'));
      }
      this.set('level', level);
    },

    select(option, e) {
      this.get('select')(option, this.get('dropdown.close'), e);
    },

    highlight(option, e) {
      this.set('highlightedLevel', null);
      this.get('highlight')(option, e);
    },

    highlightLevel(level, e) {
      this.set('highlightedLevel', level);
      this.get('highlight')(null, e);
    }
  }
});