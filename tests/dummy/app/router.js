import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
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
    this.route('the-trigger');
    this.route('the-list');
    this.route('the-search');
    this.route('styles');

    // ADVANCED CUSTOMIZATION
    this.route('asynchronous-search');

    // OTHER
    this.route('test-helpers');
    this.route('troubleshooting');
    this.route('architecture');
    this.route('api-reference');

  });
  this.route('cookbook', function() {
    this.route('bootstrap-theme');
    this.route('navigable-select');
    this.route('debounce-searches');
  });

  this.route('addons', function() {
  });

  this.route('legacy-demo');

  // Routers for tests
  this.route('helpers-testing');
});

export default Router;
