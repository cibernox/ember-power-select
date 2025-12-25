import { module, test } from 'qunit';
import { setupRenderingTest } from 'test-app/tests/helpers';
import { render, type TestContext } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { countries, type Country } from 'test-app/utils/constants';
import type { Selected, MultipleSelected } from 'ember-power-select/types';

interface CountryContext extends TestContext {
  foo: () => void;
  countries: typeof countries;
  country: Selected<Country>;
}

interface CountryMultipleContext extends TestContext {
  foo: () => void;
  countries: typeof countries;
  country: MultipleSelected<Country>;
}

module(
  'Integration | Component | Ember Power Select (Customization using attrs)',
  function (hooks) {
    setupRenderingTest(hooks);

    test<CountryContext>('the `class` attribute is forwarded to the trigger element', async function (assert) {
      assert.expect(1);

      this.countries = countries;
      this.country = countries[1]; // Spain

      await render<CountryContext>(hbs`
      <PowerSelect @renderInPlace={{true}} class="foo" @options={{this.countries}} @selected={{this.country}} @onChange={{fn (mut this.country)}} as |country|>
        {{country.name}}
      </PowerSelect>
    `);

      assert
        .dom('.ember-basic-dropdown-trigger')
        .hasClass('foo', 'Class was added.');
    });

    test<CountryContext>('trigger on single selects can be customized using triggerClass', async function (assert) {
      assert.expect(1);

      this.countries = countries;
      this.country = countries[1]; // Spain

      await render<CountryContext>(hbs`
      <PowerSelect @options={{this.countries}} @selected={{this.country}} @onChange={{fn (mut this.country)}} @triggerClass="country-single-trigger" as |country|>
        {{country.name}}
      </PowerSelect>
    `);

      assert
        .dom('.ember-power-select-trigger')
        .hasClass('country-single-trigger', 'Class was added.');
    });

    test<CountryMultipleContext>('trigger on multiple selects can be customized using @triggerClass', async function (assert) {
      assert.expect(1);

      this.countries = countries;
      if (countries[1] && countries[0]) {
        this.country = [countries[1], countries[0]];
      }

      await render<CountryMultipleContext>(hbs`
      <PowerSelectMultiple @options={{this.countries}} @selected={{this.country}} @onChange={{fn (mut this.country)}} @triggerClass="country-multiple-trigger" as |country|>
        {{country.name}}
      </PowerSelectMultiple>
    `);

      assert
        .dom('.ember-power-select-trigger')
        .hasClass('country-multiple-trigger', 'Class was added.');
    });

    test<CountryContext>('Trigger can have a custom id passing `@triggerId`', async function (assert) {
      assert.expect(1);

      this.countries = countries;
      if (countries[0]) {
        this.country = countries[0];
      }
      this.foo = () => {};

      await render<CountryContext>(hbs`
      <PowerSelect @options={{this.countries}} @selected={{this.country}} @onChange={{this.foo}} @triggerId="this-is-my-id" as |country|>
        {{country.name}}
      </PowerSelect>
    `);

      assert
        .dom('.ember-power-select-trigger')
        .hasAttribute('id', 'this-is-my-id', 'The `id` was added.');
    });

    test<CountryMultipleContext>('Trigger can have a custom id passing `@triggerId` (multiple select)', async function (assert) {
      assert.expect(1);

      this.countries = countries;
      if (countries[1] && countries[0]) {
        this.country = [countries[1], countries[0]];
      }

      await render<CountryMultipleContext>(hbs`
      <PowerSelectMultiple @options={{this.countries}} @selected={{this.country}} @onChange={{fn (mut this.country)}} @triggerId="this-is-my-id" as |country|>
        {{country.name}}
      </PowerSelectMultiple>
    `);

      assert
        .dom('.ember-power-select-trigger')
        .hasAttribute('id', 'this-is-my-id', 'The `id` was added.');
    });
  },
);
