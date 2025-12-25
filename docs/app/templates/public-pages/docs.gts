import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { LinkTo } from '@ember/routing';
import PowerSelect from 'ember-power-select/components/power-select';
import type RouterService from '@ember/routing/router-service';

const groupedSections = [
  {
    groupName: 'Getting started',
    options: [
      { route: 'public-pages.docs.index', text: 'Overview' },
      { route: 'public-pages.docs.installation', text: 'Installation' },
      { route: 'public-pages.docs.how-to-use-it', text: 'How to use it' },
      { route: 'public-pages.docs.action-handling', text: 'Action handling' },
      { route: 'public-pages.docs.groups', text: 'Groups' },
      {
        route: 'public-pages.docs.multiple-selection',
        text: 'Multiple selection',
      },
    ],
  },
  {
    groupName: 'Basic customization',
    options: [
      { route: 'public-pages.docs.the-list', text: 'The list' },
      { route: 'public-pages.docs.the-trigger', text: 'The trigger' },
      { route: 'public-pages.docs.the-search', text: 'The Search' },
      { route: 'public-pages.docs.styles', text: 'Styles' },
    ],
  },
  {
    groupName: 'Advanced customization',
    options: [
      {
        route: 'public-pages.docs.custom-search-action',
        text: 'Custom search action',
      },
    ],
  },
  {
    groupName: 'Migration',
    options: [
      {
        route: 'public-pages.docs.migrate-8-0-to-9-0',
        text: 'Migrate from 8.0 to 9.0',
      },
      {
        route: 'public-pages.docs.migrate-7-0-to-8-0',
        text: 'Migrate from 7.0 to 8.0',
      },
    ],
  },
  {
    groupName: 'Other',
    options: [
      { route: 'public-pages.docs.typescript', text: 'TypeScript' },
      { route: 'public-pages.docs.test-helpers', text: 'Test helpers' },
      { route: 'public-pages.docs.troubleshooting', text: 'Troubleshooting' },
      { route: 'public-pages.docs.architecture', text: 'Architecture' },
      { route: 'public-pages.docs.api-reference', text: 'API reference' },
    ],
  },
];

export default class Docs extends Component {
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

  @action
  visit(section: { route: string; text: string } | undefined) {
    this.router.transitionTo(section?.route);
  }

  <template>
    <section class="docs">
      <nav class="side-nav">
        <header class="side-nav-header">Getting started</header>
        <LinkTo
          @route="public-pages.docs.index"
          class="side-nav-link"
        >Overview</LinkTo>
        <LinkTo
          @route="public-pages.docs.installation"
          class="side-nav-link"
        >Installation</LinkTo>
        <LinkTo
          @route="public-pages.docs.how-to-use-it"
          class="side-nav-link"
        >How to use it</LinkTo>
        <LinkTo
          @route="public-pages.docs.action-handling"
          class="side-nav-link"
        >Action handling</LinkTo>
        <LinkTo
          @route="public-pages.docs.groups"
          class="side-nav-link"
        >Groups</LinkTo>
        <LinkTo
          @route="public-pages.docs.multiple-selection"
          class="side-nav-link"
        >Multiple selection</LinkTo>

        <header class="side-nav-header">Basic customization</header>
        <LinkTo @route="public-pages.docs.the-trigger" class="side-nav-link">The
          trigger</LinkTo>
        <LinkTo @route="public-pages.docs.the-list" class="side-nav-link">The
          list</LinkTo>
        <LinkTo @route="public-pages.docs.the-search" class="side-nav-link">The
          search</LinkTo>
        <LinkTo
          @route="public-pages.docs.styles"
          class="side-nav-link"
        >Styles</LinkTo>

        <header class="side-nav-header">Advanced customization</header>
        <LinkTo
          @route="public-pages.docs.custom-search-action"
          class="side-nav-link"
        >Custom search action</LinkTo>

        <header class="side-nav-header">Upgrade</header>
        <LinkTo
          @route="public-pages.docs.migrate-8-0-to-9-0"
          class="side-nav-link"
        >Migrate from 8.0 to 9.0</LinkTo>
        <LinkTo
          @route="public-pages.docs.migrate-7-0-to-8-0"
          class="side-nav-link"
        >Migrate from 7.0 to 8.0</LinkTo>

        <header class="side-nav-header">Other</header>
        <LinkTo
          @route="public-pages.docs.typescript"
          class="side-nav-link"
        >TypeScript</LinkTo>
        <LinkTo
          @route="public-pages.docs.test-helpers"
          class="side-nav-link"
        >Test helpers</LinkTo>
        <LinkTo
          @route="public-pages.docs.troubleshooting"
          class="side-nav-link"
        >Troubleshooting</LinkTo>
        <LinkTo
          @route="public-pages.docs.architecture"
          class="side-nav-link"
        >Architecture</LinkTo>
        <LinkTo
          @route="public-pages.docs.api-reference"
          class="side-nav-link"
        >API reference</LinkTo>
      </nav>
      <section class="doc-page">
        <div class="doc-submenu">
          <PowerSelect
            @selected={{this.currentSection}}
            @options={{this.groupedSections}}
            @onChange={{this.visit}}
            @searchField="text"
            @labelText="Submenu"
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
