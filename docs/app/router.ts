import EmberRouter from '@ember/routing/router';
import config from 'docs/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('public-pages', { path: '' }, function () {
    this.route('docs', function () {
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
      this.route('custom-search-action');

      // Migrate
      this.route('migrate-7-0-to-8-0');

      // OTHER
      this.route('test-helpers');
      this.route('troubleshooting');
      this.route('architecture');
      this.route('api-reference');
    });
    this.route('cookbook', function () {
      this.route('bootstrap-theme');
      this.route('material-theme');
      this.route('css-animations');
      // this.route('navigable-select');
      this.route('debounce-searches');
      this.route('create-custom-options');
    });
  });
});
