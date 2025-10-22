import Component from '@glimmer/component';
import CodeExample from 'docs/components/code-example';
import { LinkTo } from '@ember/routing';
import PowerSelect from 'ember-power-select/components/power-select';
import { fn } from '@ember/helper';

const countries = [
  { name: 'United States', flagUrl: '/flags/us.svg' },
  { name: 'Spain', flagUrl: '/flags/es.svg' },
  { name: 'Portugal', flagUrl: '/flags/pt.svg' },
  { name: 'Russia', flagUrl: '/flags/ru.svg' },
  { name: 'Latvia', flagUrl: '/flags/lv.svg' },
  { name: 'Brazil', flagUrl: '/flags/br.svg' },
  { name: 'United Kingdom', flagUrl: '/flags/gb.svg' },
];

const cities = [
  'Barcelona',
  'London',
  'New York',
  'Porto',
  'Coruña',
  'Kracow',
  'Siena',
  'Portland',
  'Springfield',
  'Tokio',
];

const groupedNumbers = [
  { groupName: 'Smalls', options: ['one', 'two', 'three'] },
  { groupName: 'Mediums', options: ['four', 'five', 'six'] },
  {
    groupName: 'Bigs',
    options: [
      { groupName: 'Fairly big', options: ['seven', 'eight', 'nine'] },
      { groupName: 'Really big', options: ['ten', 'eleven', 'twelve'] },
      'thirteen',
    ],
  },
  'one hundred',
  'one thousand',
];

export default class MaterialTheme extends Component {
  cities = cities;
  countries = countries;
  groupedNumbers = groupedNumbers;
  city = null;
  country = null;
  country2 = null;
  country3 = null;
  selectedCountries = null;
  number = null;

  <template>
    <h1 class="doc-page-title">Material theme</h1>

    <p>
      Like with bootstrap, it's not a lot of code to create a material-design
      theme using the available SASS variables and a couple animations before
      importing the styles of the addon.
    </p>

    <CodeExample
      @scss="material-theme-1.scss"
      @showResult={{false}}
      @activeTab="scss"
      @codeBlockClass="max-500-height"
    />

    <h2 class="t3">Regular selects without search</h2>
    <div style="display: flex;">
      <div style="flex: 1; padding: 5px;">
        <PowerSelect
          @triggerClass="material-theme-trigger"
          @dropdownClass="material-theme-dropdown"
          @options={{this.countries}}
          @selected={{this.country}}
          @placeholder="Country"
          @searchField="name"
          @onChange={{fn (mut this.country)}}
          as |country|
        >
          {{country.name}}
        </PowerSelect>
      </div>
      <div style="flex: 1; padding: 5px;">
        <PowerSelect
          @triggerClass="material-theme-trigger"
          @dropdownClass="material-theme-dropdown"
          @options={{this.cities}}
          @selected={{this.city}}
          @placeholder="City"
          @allowClear={{true}}
          @onChange={{fn (mut this.city)}}
          as |city|
        >
          {{city}}
        </PowerSelect>
      </div>
    </div>

    <h2 class="t3">Regular selects with search</h2>
    <PowerSelect
      @triggerClass="material-theme-trigger"
      @dropdownClass="material-theme-dropdown"
      @options={{this.countries}}
      @selected={{this.country2}}
      @placeholder="Country"
      @searchField="name"
      @searchEnabled={{true}}
      @onChange={{fn (mut this.country2)}}
      as |country|
    >
      {{country.name}}
    </PowerSelect>

    <h2 class="t3">Multiple selects with search</h2>
    <PowerSelect
      @multiple={{true}}
      @triggerClass="material-theme-trigger"
      @dropdownClass="material-theme-dropdown"
      @options={{this.countries}}
      @selected={{this.selectedCountries}}
      @placeholder="Country"
      @searchField="name"
      @searchEnabled={{true}}
      @onChange={{fn (mut this.selectedCountries)}}
      as |country|
    >
      {{country.name}}
    </PowerSelect>
    <h2 class="t3">Groups</h2>
    <PowerSelect
      @triggerClass="material-theme-trigger"
      @dropdownClass="material-theme-dropdown"
      @options={{this.groupedNumbers}}
      @selected={{this.number}}
      @placeholder="Choose a number"
      @onChange={{fn (mut this.number)}}
      as |num|
    >
      {{num}}
    </PowerSelect>

    <h2 class="t3">Select with clear btn</h2>
    <PowerSelect
      @triggerClass="material-theme-trigger"
      @dropdownClass="material-theme-dropdown"
      @options={{this.countries}}
      @selected={{this.country3}}
      @placeholder="Country"
      @searchField="name"
      @allowClear={{true}}
      @searchEnabled={{true}}
      @onChange={{fn (mut this.country3)}}
      as |country|
    >
      {{country.name}}
    </PowerSelect>
    <br />
    <br />
    <p>
      This theme doesn't attempt to provide totally accurate replica of the
      angular directive, but it's a good start.
    </p>

    <p>To use it in your app, SASS users should import the theme before
      importing the main stylesheet:</p>

    <CodeExample
      @scss="material-theme-2.scss"
      @showResult={{false}}
      @activeTab="scss"
    />

    <p>
      As with the bootstrap one, this skin comes pre-compiled in the app, apps
      that don't use SASS/LESS can include it by replacing the styles import in
      <code>app.js</code>
      to:
    </p>

    <CodeExample
      @js="material-theme-3.js"
      @showResult={{false}}
      @activeTab="js"
    />

    <p>In the next section we're going to explain how come this select can be
      animated without any javascript!</p>

    <div class="doc-page-nav">
      <LinkTo
        @route="public-pages.cookbook.bootstrap-theme"
        class="doc-page-nav-link-prev"
      >&lt; Bootstrap theme</LinkTo>
      <LinkTo
        @route="public-pages.cookbook.css-animations"
        class="doc-page-nav-link-next"
      >CSS animations &gt;</LinkTo>
    </div>
  </template>
}
