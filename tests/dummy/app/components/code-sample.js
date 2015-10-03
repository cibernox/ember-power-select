import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'article',
  classNames: ['code-sample'],
  tabs: ['template', 'javascript', 'result'],
  activeTab: 'template',

  // Hooks
  didInsertElement() {
    this._super(...arguments);
    if (window.hljs) {
      this.$('pre').each(function(i, block) {
        window.hljs.highlightBlock(block, { languages: ['js', 'hbs'] });
      });
    }
  }
});