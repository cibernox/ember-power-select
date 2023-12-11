import EmberRouter from '@ember/routing/router';
import config from 'test-app/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  // Routes for tests
  this.route('helpers-testing');
  this.route('helpers-testing-single-power-select');
});
