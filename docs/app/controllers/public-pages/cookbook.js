import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

const groupedSections = [
  {
    groupName: 'Basic recipes',
    options: [
      { route: 'public-pages.cookbook.index', text: 'System-wide config' },
      {
        route: 'public-pages.cookbook.bootstrap-theme',
        text: 'Bootstrap theme',
      },
      { route: 'public-pages.cookbook.material-theme', text: 'Material theme' },
      { route: 'public-pages.cookbook.css-animations', text: 'CSS animations' },
      {
        route: 'public-pages.cookbook.debounce-searches',
        text: 'Debounce searches',
      },
      {
        route: 'public-pages.cookbook.create-custom-options',
        text: 'Create custom options',
      },
    ],
  },
  // {
  //   groupName: 'Advanced recipes',
  //   options: [
  //     { route: 'public-pages.cookbook.navigable-select', text: 'Navigable select' }
  //   ]
  // }
];

export default class extends Controller {
  @service router;
  groupedSections = groupedSections;

  @computed('router.currentRouteName')
  get currentSection() {
    let currentRouteName = this.router.currentRouteName;
    for (let i = 0; i < groupedSections.length; i++) {
      let group = groupedSections[i];
      for (let j = 0; j < group.options.length; j++) {
        let section = group.options[j];
        if (section.route === currentRouteName) {
          return section;
        }
      }
    }
    return undefined;
  }

  visit(section) {
    this.transitionToRoute(section.route);
  }
}
