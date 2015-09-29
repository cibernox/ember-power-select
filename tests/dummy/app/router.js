import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('docs', function() {
    // index.hbs is "Overview"
    this.route('installation');
    this.route('how-to-use-it');
    this.route('action-handling');
    this.route('groups');
    this.route('multiple-selection');
  });
  this.route('cookbook');
  this.route('legacy-demo');
});

export default Router;
