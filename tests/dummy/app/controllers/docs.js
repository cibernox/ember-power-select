import Ember from 'ember';

export default Ember.Controller.extend({
  sections: [
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
        { route: 'docs.list-items',       text: 'List items' },
        { route: 'docs.empty-list',       text: 'Empty list' },
        { route: 'docs.selected-element', text: 'Selected element' },
        { route: 'docs.messages',         text: 'Messages' },
        { route: 'docs.filtering',        text: 'Filtering' },
        { route: 'docs.styles',           text: 'Styles' },
      ]
    },
    {
      groupName: 'Advanced customization',
      options: [
        { route: 'docs.partials',               text: 'Partials' },
        { route: 'docs.asynchronous-search',    text: 'Asynchronous search' },
        { route: 'docs.roll-your-own-template', text: 'Roll your own template' },
      ]
    }
  ],

  actions: {
    visit(section) {
      this.transitionToRoute(section.route);
    }
  }
});
