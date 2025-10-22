import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type RouterService from '@ember/routing/router-service';

export default class PublicPagesCookbookIndexRoute extends Route {
  @service declare router: RouterService;

  redirect() {
    this.router.transitionTo('public-pages.cookbook.bootstrap-theme');
  }
}
