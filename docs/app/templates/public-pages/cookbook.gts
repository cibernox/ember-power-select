import Component from '@glimmer/component';
import { service } from '@ember/service';
import { LinkTo } from '@ember/routing';
import PowerSelect from 'ember-power-select/components/power-select';
import type RouterService from '@ember/routing/router-service';

const groupedSections = [
  {
    groupName: 'Basic recipes',
    options: [
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

export default class extends Component {
  @service declare router: RouterService;

  groupedSections = groupedSections;

  get currentSection() {
    const currentRouteName = this.router.currentRouteName;
    for (let i = 0; i < groupedSections.length; i++) {
      const group = groupedSections[i];
      if (group) {
        for (let j = 0; j < group.options.length; j++) {
          const section = group.options[j];
          if (section) {
            if (section.route === currentRouteName) {
              return section;
            }
          }
        }
      }
    }
    return undefined;
  }

  visit(section: {
    route: string;
    text: string;
}) {
    this.router.transitionTo(section.route);
  }

  <template>
    <section class="docs">
      <nav class="side-nav">
        <header class="side-nav-header">Basic recipes</header>
        <LinkTo
          @route="public-pages.cookbook.bootstrap-theme"
          class="side-nav-link"
        >Bootstrap theme</LinkTo>
        <LinkTo
          @route="public-pages.cookbook.material-theme"
          class="side-nav-link"
        >Material theme</LinkTo>
        <LinkTo
          @route="public-pages.cookbook.css-animations"
          class="side-nav-link"
        >CSS Animations</LinkTo>
        <LinkTo
          @route="public-pages.cookbook.debounce-searches"
          class="side-nav-link"
        >Debounce searches</LinkTo>
        <LinkTo
          @route="public-pages.cookbook.create-custom-options"
          class="side-nav-link"
        >Create custom options</LinkTo>
        {{! <header class="side-nav-header">Advanced recipes</header>
        <LinkTo @route="public-pages.cookbook.navigable-select" class="side-nav-link">Navigable select</LinkTo> }}
      </nav>
      <section class="doc-page">
        <div class="doc-submenu">
          <PowerSelect
            @selected={{this.currentSection}}
            @options={{this.groupedSections}}
            @onChange={{this.visit}}
            @labelText="Submenu"
            @searchField="text"
            @triggerClass="section-selector"
            as |option|
          >
            {{option.text}}
          </PowerSelect>
        </div>
        {{outlet}}
      </section>
    </section>
  </template>
}
