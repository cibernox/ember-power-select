import Ember from 'ember';

const { computed } = Ember;
const { service } = Ember.inject;

const groupedSections = [
  {
    groupName: 'Getting started',
    options: [
      { route: 'docs.index',              text: 'Overview' },
      { route: 'docs.installation',       text: 'Installation' },
      { route: 'docs.how-to-use-it',      text: 'How to use it' },
      { route: 'docs.action-handling',    text: 'Action handling' },
      { route: 'docs.groups',             text: 'Groups' },
      { route: 'docs.multiple-selection', text: 'Multiple selection' }
    ]
  },
  {
    groupName: 'Basic customization',
    options: [
      { route: 'docs.the-list',         text: 'The list' },
      { route: 'docs.the-trigger',      text: 'The trigger' },
      { route: 'docs.the-search',       text: 'The Search' },
      { route: 'docs.styles',           text: 'Styles' },
    ]
  },
  {
    groupName: 'Advanced customization',
    options: [
      { route: 'docs.asynchronous-search', text: 'Asynchronous search' },
    ]
  },
  {
    groupName: 'Other',
    options: [
      { route: 'docs.test-helpers', text: 'Test helpers' },
      { route: 'docs.troubleshooting', text: 'Troubleshooting' },
      { route: 'docs.api-reference', text: 'API reference' }
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
