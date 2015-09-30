import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('docs', function() {
    // GETTING STARTED
    // index.hbs is "Overview"
    this.route('installation');
    this.route('how-to-use-it');
    this.route('action-handling');
    this.route('groups');
    this.route('multiple-selection');

    // BASIC CUSTOMIZATION
    this.route('list-items');
    this.route('empty-list');
    this.route('selected-element');
    this.route('messages');
    this.route('filtering');
    this.route('styles');

    // ADVANCED CUSTOMIZATION
    this.route('partials');
    this.route('asynchronous-search');
    this.route('roll-your-own-template');

  });
  this.route('cookbook');
  this.route('legacy-demo');
});

export default Router;
