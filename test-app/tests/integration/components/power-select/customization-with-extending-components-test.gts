import { module, test } from 'qunit';
import { setupRenderingTest } from 'test-app/tests/helpers';
import { render } from '@ember/test-helpers';
import {
  countries,
  groupedNumbers,
  type Country,
  type GroupedNumber,
  type SelectedCountryExtra,
} from 'test-app/utils/constants';
import { clickTrigger } from 'ember-power-select/test-support/helpers';
import type { TestContext } from '@ember/test-helpers';
import type { Selected } from 'ember-power-select/types';
import type { ComponentLike } from '@glint/template';
import type { PowerSelectTriggerSignature } from 'ember-power-select/components/power-select/trigger';
import SelectedCountry from 'test-app/components/selected-country';
import ListOfCountries from 'test-app/components/list-of-countries';
import type { PowerSelectOptionsSignature } from 'ember-power-select/components/power-select/options';
import type { PowerSelectBeforeOptionsSignature } from 'ember-power-select/components/power-select/before-options';
import type { PowerSelectPlaceholderSignature } from 'ember-power-select/components/power-select/placeholder';
import CustomBeforeOptions from 'test-app/components/custom-before-options';
import PowerSelectPlaceholder from 'ember-power-select/components/power-select/placeholder';
import type { PowerSelectSearchMessageSignature } from 'ember-power-select/components/power-select/search-message';
import CustomSearchMessage from 'test-app/components/custom-search-message';
import type { PowerSelectNoMatchesMessageSignature } from 'ember-power-select/components/power-select/no-matches-message';
import CustomNoMatchesMessage from 'test-app/components/custom-no-matches-message';
import CustomPlaceholder from 'test-app/components/custom-placeholder';
import type { PowerSelectPowerSelectGroupSignature } from 'ember-power-select/components/power-select/power-select-group';
import CustomGroupComponent from 'test-app/components/custom-group-component';
import PowerSelect from 'ember-power-select/components/power-select';
import { fn, hash } from '@ember/helper';
import PowerSelectMultiple from 'ember-power-select/components/power-select-multiple';

interface CountryContext<
  IsMultiple extends boolean = false,
> extends TestContext {
  foo: () => void;
  countries: typeof countries;
  country: Selected<Country, IsMultiple>;
  searchFn: () => typeof countries;
  triggerComponent: ComponentLike<
    PowerSelectTriggerSignature<Country, SelectedCountryExtra, IsMultiple>
  >;
  optionsComponent: ComponentLike<
    PowerSelectOptionsSignature<Country, SelectedCountryExtra, IsMultiple>
  >;
  beforeOptionsComponent: ComponentLike<
    PowerSelectBeforeOptionsSignature<Country, SelectedCountryExtra, IsMultiple>
  >;
  placeholderComponent: ComponentLike<
    PowerSelectPlaceholderSignature<Country, SelectedCountryExtra, IsMultiple>
  >;
  searchMessageComponent: ComponentLike<
    PowerSelectSearchMessageSignature<Country, SelectedCountryExtra, IsMultiple>
  >;
  noMatchesMessageComponent: ComponentLike<
    PowerSelectNoMatchesMessageSignature<
      Country,
      SelectedCountryExtra,
      IsMultiple
    >
  >;
}

interface GroupedNumbersContext<
  IsMultiple extends boolean = false,
> extends TestContext {
  foo: (selected: string | undefined) => void;
  groupedNumbers: GroupedNumber[];
  groupComponent: ComponentLike<
    PowerSelectPowerSelectGroupSignature<GroupedNumber, unknown, IsMultiple>
  >;
}

module(
  'Integration | Component | Ember Power Select (Customization with overwriting components)',
  function (hooks) {
    setupRenderingTest(hooks);

    test<CountryContext>('overwriting `power-select/trigger` works', async function (assert) {
      const self = this;

      assert.expect(3);

      this.countries = countries;
      this.country = countries[1]; // Spain

      this.triggerComponent = SelectedCountry;

      await render<CountryContext>(
        <template>
          <PowerSelect
            @options={{self.countries}}
            @selected={{self.country}}
            @triggerComponent={{self.triggerComponent}}
            @onChange={{fn (mut self.country)}}
            as |country|
          >
            {{country.name}}
          </PowerSelect>
        </template>,
      );

      assert
        .dom('.ember-power-select-status-icon')
        .doesNotExist('The provided trigger component is not rendered');
      assert
        .dom('.ember-power-select-trigger .icon-flag')
        .exists('The custom flag appears.');
      assert
        .dom('.ember-power-select-trigger')
        .hasText('Spain', 'With the country name as the text.');
    });

    test<CountryContext>('overwriting `power-select/options` works', async function (assert) {
      const self = this;

      assert.expect(2);

      this.countries = countries;
      this.country = countries[1]; // Spain

      this.optionsComponent = ListOfCountries;

      await render<CountryContext>(
        <template>
          <PowerSelect
            @options={{self.countries}}
            @selected={{self.country}}
            @optionsComponent={{self.optionsComponent}}
            @onChange={{fn (mut self.country)}}
            as |country|
          >
            {{country.name}}
          </PowerSelect>
        </template>,
      );

      await clickTrigger();

      assert
        .dom('.ember-power-select-options')
        .includesText('Countries:', 'The given component is rendered');
      assert
        .dom('.ember-power-select-options')
        .includesText('3. Russia', 'The component has access to the options');
    });

    test<CountryContext>('overwriting `power-select/before-options` works', async function (assert) {
      const self = this;

      assert.expect(4);

      this.countries = countries;
      this.country = countries[1]; // Spain

      this.beforeOptionsComponent = CustomBeforeOptions;
      this.placeholderComponent = PowerSelectPlaceholder;

      await render<CountryContext>(
        <template>
          <PowerSelect
            @options={{self.countries}}
            @beforeOptionsComponent={{self.beforeOptionsComponent}}
            @selected={{self.country}}
            @placeholder="inception"
            @placeholderComponent={{self.placeholderComponent}}
            @onChange={{fn (mut self.country)}}
            as |country|
          >
            {{country.name}}
          </PowerSelect>
        </template>,
      );

      await clickTrigger();

      assert
        .dom('.ember-power-select-dropdown #custom-before-options-p-tag')
        .exists(
          'The custom component is rendered instead of the usual search bar',
        );
      assert
        .dom('.ember-power-select-dropdown #custom-before-options-p-tag')
        .hasText('inception', 'The placeholder attribute is passed through.');
      assert
        .dom('.ember-power-select-dropdown .ember-power-select-placeholder')
        .exists('The placeholder component is passed through.');
      assert
        .dom('.ember-power-select-search-input')
        .doesNotExist('The search input is not visible');
    });

    test<CountryContext>('overwriting `power-select/search-message` works', async function (assert) {
      const self = this;

      assert.expect(1);

      this.searchFn = () => [];

      this.foo = () => {};

      this.searchMessageComponent = CustomSearchMessage;

      await render<CountryContext>(
        <template>
          <PowerSelect
            @search={{self.searchFn}}
            @searchMessageComponent={{self.searchMessageComponent}}
            @onChange={{self.foo}}
            as |country|
          >
            {{country.name}}
          </PowerSelect>
        </template>,
      );

      await clickTrigger();
      assert
        .dom('.ember-power-select-dropdown #custom-search-message-p-tag')
        .exists(
          'The custom component is rendered instead of the usual message',
        );
    });

    test<CountryContext>('overwriting `power-select/no-matches-message` works', async function (assert) {
      const self = this;

      assert.expect(2);

      this.countries = [];

      this.foo = () => {};

      this.noMatchesMessageComponent = CustomNoMatchesMessage;

      await render<CountryContext>(
        <template>
          <PowerSelect
            @options={{self.countries}}
            @noMatchesMessageComponent={{self.noMatchesMessageComponent}}
            @noMatchesMessage="Nope"
            @onChange={{self.foo}}
            as |option|
          >
            {{option.name}}
          </PowerSelect>
        </template>,
      );

      await clickTrigger();

      assert
        .dom('.ember-power-select-dropdown #custom-no-matches-message-p-tag')
        .exists(
          'The custom component is rendered instead of the usual message',
        );
      assert.dom('#custom-no-matches-message-p-tag').hasText('Nope');
    });

    test<CountryContext>('overwriting `power-select/placeholder` works', async function (assert) {
      const self = this;

      assert.expect(2);

      this.countries = countries;
      this.foo = () => {};
      this.placeholderComponent = CustomPlaceholder;

      await render<CountryContext>(
        <template>
          <PowerSelect
            @options={{self.countries}}
            @placeholder="test"
            @placeholderComponent={{self.placeholderComponent}}
            @onChange={{self.foo}}
            as |country|
          >
            {{country.name}}
          </PowerSelect>
        </template>,
      );

      assert
        .dom('.ember-power-select-placeholder')
        .exists('The placeholder appears.');
      assert
        .dom('.ember-power-select-placeholder')
        .hasText(
          'This is a very bold placeholder',
          'The placeholder content is equal.',
        );
    });

    test<GroupedNumbersContext>('overwriting `power-select/power-select-group` works', async function (assert) {
      const self = this;

      this.groupedNumbers = groupedNumbers;
      const numberOfGroups = 5; // number of groups in groupedNumber;

      this.groupComponent = CustomGroupComponent;

      this.foo = () => {};

      await render<GroupedNumbersContext>(
        <template>
          <PowerSelect
            @options={{self.groupedNumbers}}
            @groupComponent={{self.groupComponent}}
            @onChange={{self.foo}}
            as |number|
          >
            {{number}}
          </PowerSelect>
        </template>,
      );

      await clickTrigger();
      assert
        .dom('.ember-power-select-options .custom-component')
        .exists({ count: numberOfGroups });
    });

    test<
      CountryContext<true>
    >('overwriting `power-select-multiple/trigger` works', async function (assert) {
      const self = this;

      assert.expect(1);

      this.countries = countries;
      if (countries[1]) {
        this.country = [countries[1]]; // Spain
      }

      this.triggerComponent = SelectedCountry;

      await render<CountryContext<true>>(
        <template>
          <PowerSelectMultiple
            @options={{self.countries}}
            @selected={{self.country}}
            @triggerComponent={{self.triggerComponent}}
            @onChange={{fn (mut self.country)}}
            @extra={{hash coolFlagIcon=true}}
            as |country|
          >
            {{country.code}}
          </PowerSelectMultiple>
        </template>,
      );

      await clickTrigger();

      assert
        .dom('.ember-power-select-trigger .cool-flag-icon')
        .exists(
          { count: 1 },
          'The custom triggerComponent renders with the extra.coolFlagIcon customization option triggering some state change.',
        );
    });
  },
);
