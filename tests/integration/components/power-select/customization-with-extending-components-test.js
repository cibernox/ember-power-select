import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { countries } from '../constants';
import { groupedNumbers } from '../constants';
import { clickTrigger } from 'ember-power-select/test-support/helpers';

module(
  'Integration | Component | Ember Power Select (Customization with overwriting components)',
  function (hooks) {
    setupRenderingTest(hooks);

    test('overwriting `power-select/trigger` works', async function (assert) {
      assert.expect(3);

      this.countries = countries;
      this.country = countries[1]; // Spain

      await render(hbs`
      <PowerSelect 
        @options={{this.countries}} 
        @selected={{this.country}} 
        @triggerComponent={{component "selected-country"}} 
        @onChange={{fn (mut this.country)}} as |country|>
        {{country.name}}
      </PowerSelect>
    `);

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

    test('overwriting `power-select/options` works', async function (assert) {
      assert.expect(2);

      this.countries = countries;
      this.country = countries[1]; // Spain

      await render(hbs`
      <PowerSelect 
        @options={{this.countries}} 
        @selected={{this.country}} 
        @optionsComponent={{component "list-of-countries"}} 
        @onChange={{fn (mut this.foo)}} as |country|>
        {{country.name}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-options')
        .includesText('Countries:', 'The given component is rendered');
      assert
        .dom('.ember-power-select-options')
        .includesText('3. Russia', 'The component has access to the options');
    });

    test('overwriting `power-select/before-options` works', async function (assert) {
      assert.expect(4);

      this.countries = countries;
      this.country = countries[1]; // Spain

      await render(hbs`
      <PowerSelect
        @options={{this.countries}}
        @beforeOptionsComponent={{component "custom-before-options"}}
        @selected={{this.country}}
        @placeholder="inception"
        @placeholderComponent={{component "power-select/placeholder"}}
        @onChange={{fn (mut this.foo)}} as |country|>
        {{country.name}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-dropdown #custom-before-options-p-tag')
        .exists(
          'The custom component is rendered instead of the usual search bar'
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

    test('overwriting `power-select/search-message` works', async function (assert) {
      assert.expect(1);

      this.searchFn = function () {};
      await render(hbs`
      <PowerSelect 
        @search={{this.searchFn}} 
        @searchMessageComponent={{component "custom-search-message"}}
        @onChange={{fn (mut this.foo)}} as |country|>
        {{country.name}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-dropdown #custom-search-message-p-tag')
        .exists(
          'The custom component is rendered instead of the usual message'
        );
    });

    test('overwriting `power-select/no-matches-message` works', async function (assert) {
      assert.expect(2);

      this.options = [];

      await render(hbs`
      <PowerSelect 
        @options={{this.options}} 
        @noMatchesMessageComponent={{component "custom-no-matches-message"}}
        @noMatchesMessage="Nope" 
        @onChange={{fn (mut this.foo)}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();

      assert
        .dom('.ember-power-select-dropdown #custom-no-matches-message-p-tag')
        .exists(
          'The custom component is rendered instead of the usual message'
        );
      assert.dom('#custom-no-matches-message-p-tag').hasText('Nope');
    });

    test('overwriting `power-select/placeholder` works', async function (assert) {
      assert.expect(2);

      this.countries = countries;

      await render(hbs`
      <PowerSelect
        @options={{this.countries}}
        @placeholder="test"
        @placeholderComponent={{component "custom-placeholder"}}
        @onChange={{fn (mut this.foo)}} as |country|>
        {{country.name}}
      </PowerSelect>
    `);

      assert
        .dom('.ember-power-select-placeholder')
        .exists('The placeholder appears.');
      assert
        .dom('.ember-power-select-placeholder')
        .hasText(
          'This is a very bold placeholder',
          'The placeholder content is equal.'
        );
    });

    test('overwriting `power-select/power-select-group` works', async function (assert) {
      this.groupedNumbers = groupedNumbers;
      let numberOfGroups = 5; // number of groups in groupedNumber;

      await render(hbs`
      <PowerSelect 
        @options={{this.groupedNumbers}} 
        @groupComponent={{component "custom-group-component"}}
        @onChange={{fn (mut this.foo)}} as |country|>
        {{country.name}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-options .custom-component')
        .exists({ count: numberOfGroups });
    });

    test('overwriting `power-select-multiple/trigger` works', async function (assert) {
      assert.expect(1);

      this.countries = countries;
      this.country = countries[1]; // Spain

      await render(hbs`
      <PowerSelectMultiple 
        @options={{this.countries}}
        @selected={{this.country}} 
        @triggerComponent={{component "selected-country"}}
        @onChange={{fn (mut this.foo)}} 
        @extra={{hash coolFlagIcon=true}} as |country|>
        {{country.code}}
      </PowerSelectMultiple>
    `);

      await clickTrigger();

      assert
        .dom('.ember-power-select-trigger .cool-flag-icon')
        .exists(
          { count: 1 },
          'The custom triggerComponent renders with the extra.coolFlagIcon customization option triggering some state change.'
        );
    });
  }
);
