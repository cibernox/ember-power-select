  import Ember from 'ember';

const { computed } = Ember;
const { service } = Ember.inject;

const groupedSections = [
  {
    groupName: 'Basic recipes',
    options: [
      { route: 'cookbook.index',            text: 'System-wide config' },
      { route: 'cookbook.bootstrap-theme',  text: 'Bootstrap theme' },
      { route: 'cookbook.debounce-searches',text: 'Debounce searches' },
    ]
  },
  {
    groupName: 'Advanced recipes',
    options: [
      { route: 'cookbook.navigable-select', text: 'Navigable select' },
    ]
  }
];

export default Ember.Controller.extend({
  routing: service('-routing'),
  groupedSections: groupedSections,

  currentSection: computed('routing.currentRouteName', function() {
    const currentRouteName = this.get('routing.currentRouteName');
    for (let group of groupedSections) {
      for (let section of group.options){
        if (section.route === currentRouteName) {
          return section;
        }
      }
    }
  }),

  actions: {
    visit(section) {
      this.transitionToRoute(section.route);
    }
  }
});
