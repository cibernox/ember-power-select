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

export default class BootstrapTheme extends Component {
  options = countries;
  selectedSingle = null;
  selectedMultiple = [];

  <template>
    <h1 class="doc-page-title">Bootstrap theme</h1>

    <p>
      In the
      <LinkTo @route="public-pages.docs.styles">chapter about styles</LinkTo>
      of the docs you've seen how, if you are a Sass user, you can customize the
      styles of the dropdown by defining some variables before importing the styles
      of the addon.
    </p>

    <p>
      This approach can allow a great amount of customization with only a few lines
      of code. By example this is all that takes to create a Bootstrap 3 theme:
    </p>

    <CodeExample
      @scss="bootstrap-theme-1.scss"
      @showResult={{false}}
      @activeTab="scss"
    />

    <p>
      Since bootstrap is so popular this theme comes already bundled in Ember Power
      Select, so the only thing you have to do is to import the theme file before
      the main one:
    </p>

    <CodeExample
      @scss="bootstrap-theme-2.scss"
      @showResult={{false}}
      @activeTab="scss"
    />

    <p>
      The result looks like this:
    </p>

    <div class="evenly-splitted">
      <div>
        <PowerSelect
          @options={{this.options}}
          @selected={{this.selectedSingle}}
          @onChange={{fn (mut this.selectedSingle)}}
          @searchEnabled={{true}}
          @searchField="name"
          @triggerClass="bootstrap-theme-trigger"
          @dropdownClass="bootstrap-theme-dropdown"
          as |country|
        >
          <img
            src={{country.flagUrl}}
            class="icon-flag"
            alt="Country of {{country.name}}"
          />
          <strong>{{country.name}}</strong>
        </PowerSelect>
      </div>
      <div>
        <PowerSelect
          @multiple={{true}}
          @options={{this.options}}
          @selected={{this.selectedMultiple}}
          @onChange={{fn (mut this.selectedMultiple)}}
          @searchEnabled={{true}}
          @searchField="name"
          @triggerClass="bootstrap-theme-trigger"
          @dropdownClass="bootstrap-theme-dropdown"
          as |country|
        >
          <img
            src={{country.flagUrl}}
            class="icon-flag"
            alt="Country of {{country.name}}"
          />
          <strong>{{country.name}}</strong>
        </PowerSelect>
      </div>
    </div>

    <p>
      If your project is not using sass/less, you can still use the precompiled
      bootstrap theme instead of the default one by replacing the styles import in
      <code>app.js</code>
      to:
    </p>

    <CodeExample
      @js="bootstrap-theme-3.js"
      @showResult={{false}}
      @activeTab="js"
    />

    <div class="doc-page-nav">
      <LinkTo
        @route="public-pages.cookbook.material-theme"
        class="doc-page-nav-link-next"
      >Material theme &gt;</LinkTo>
    </div>
  </template>
}
