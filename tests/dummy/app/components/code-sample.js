import Ember from 'ember';
const { computed } = Ember;

export default Ember.Component.extend({
  tagName: 'article',
  classNames: ['code-sample'],
  showResult: true,

  activeTab: computed('showResult', function() {
    if (this.get('showResult')) {
      return 'result';
    }
    return 'js';
  }),

  partialName: computed('hbs', function() {
    return `snippets/${this.get('hbs').replace('.hbs', '')}`;
  })
});