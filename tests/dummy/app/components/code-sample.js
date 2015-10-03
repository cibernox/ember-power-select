import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'article',
  classNames: ['code-sample'],
  tabs: ['template', 'javascript', 'result'],
  activeTab: 'template'
});