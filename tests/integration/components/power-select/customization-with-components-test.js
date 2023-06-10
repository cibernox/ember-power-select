import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, focus } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { countries } from '../constants';
import { groupedNumbers } from '../constants';
import { clickTrigger } from 'ember-power-select/test-support/helpers';
import { isPresent } from '@ember/utils';

module(
  'Integration | Component | Ember Power Select (Customization using components)',
  function (hooks) {
    setupRenderingTest(hooks);

    test('selected option can be customized using triggerComponent', async function (assert) {
      assert.expect(3);

      this.countries = countries;
      this.country = countries[1]; // Spain

      await render(hbs`
      <PowerSelect 
        @options={{this.countries}} 
        @selected={{this.country}} 
        @triggerComponent={{component "selected-country"}} 
        @onChange={{fn (mut this.foo)}} as |country|>
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

    test('triggerComponent receives loading message', async function (assert) {
      assert.expect(1);
      this.countries = countries;

      await render(hbs`
      <PowerSelect
        @options={{this.countries}}
        @loadingMessage="hmmmm paella"
        @selected={{this.country}}
        @triggerComponent={{component "custom-trigger-component"}}
        @onChange={{fn (mut this.foo)}} as |country|>
        {{country}}
      </PowerSelect>
    `);
      assert
        .dom('.custom-trigger-component')
        .hasText(
          'hmmmm paella',
          'The loading message is passed to the trigger component'
        );
    });

    test('selected item option can be customized using `@selectedItemComponent`', async function (assert) {
      assert.expect(3);

      this.countries = countries;
      this.country = countries[1]; // Spain

      await render(hbs`
      <PowerSelect 
        @options={{this.countries}} 
        @selected={{this.country}} 
        @selectedItemComponent={{component "selected-country"}} 
        @onChange={{fn (mut this.foo)}} as |country|>
        {{country.name}}
      </PowerSelect>
    `);

      assert
        .dom('.ember-power-select-status-icon')
        .exists('The provided trigger component is rendered');
      assert
        .dom('.ember-power-select-trigger .icon-flag')
        .exists('The custom flag appears.');
      assert
        .dom('.ember-power-select-trigger')
        .hasText('Spain', 'With the country name as the text.');
    });

    test('the list of options can be customized using `@optionsComponent`', async function (assert) {
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

    test('the `@optionsComponent` receives the `@extra` hash', async function (assert) {
      assert.expect(2);

      this.countries = countries;
      this.country = countries[1]; // Spain

      await render(hbs`
      <PowerSelect 
        @options={{this.countries}} 
        @selected={{this.country}} 
        @optionsComponent={{component "list-of-countries"}} 
        @onChange={{fn (mut this.foo)}} 
        @extra={{hash field="code"}} as |country|>
        {{country.code}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-options')
        .includesText('Countries:', 'The given component is rendered');
      assert
        .dom('.ember-power-select-options')
        .includesText(
          '3. RU',
          'The component uses the field in the extra has to render the options'
        );
    });

    test('the content before the list can be customized passing `@beforeOptionsComponent`', async function (assert) {
      assert.expect(4);

      this.countries = countries;
      this.country = countries[1]; // Spain

      await render(hbs`
      <PowerSelect
        @selected={{this.country}}
        @beforeOptionsComponent={{component "custom-before-options"}}
        @options={{this.countries}}
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

    test('the content after the list can be customized passing `@afterOptionsComponent`', async function (assert) {
      assert.expect(2);

      this.countries = countries;
      this.country = countries[1]; // Spain

      await render(hbs`
      <PowerSelect
        @options={{this.countries}}
        @selected={{this.country}}
        @afterOptionsComponent={{component "custom-after-options"}}
        @onChange={{fn (mut this.foo)}}
        @searchEnabled={{true}} as |country|>
        {{country.name}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-dropdown #custom-after-options-p-tag')
        .exists(
          'The custom component is rendered instead of the usual search bar'
        );
      assert
        .dom('.ember-power-select-search-input')
        .exists('The search input is still visible');
    });

    test('the `@beforeOptionsComponent` and `@afterOptionsComponent` receive the `@extra` hash', async function (assert) {
      assert.expect(1);

      let counter = 0;
      this.countries = countries;
      this.country = countries[1]; // Spain
      this.someAction = function () {
        counter++;
      };

      await render(hbs`
      <PowerSelect
        @options={{this.countries}}
        @selected={{this.country}}
        @onChange={{fn (mut this.selected)}}
        @afterOptionsComponent={{component "custom-after-options-two"}}
        @beforeOptionsComponent={{component "custom-before-options-two"}}
        @extra={{hash passedAction=this.someAction}} as |country|>
        {{country.name}}
      </PowerSelect>
    `);

      await clickTrigger();
      await click('.custom-before-options2-button');
      await click('.custom-after-options2-button');
      assert.strictEqual(
        counter,
        2,
        'The action inside the extra hash has been called twice'
      );
    });

    test('the `@triggerComponent` receives the `@onFocus` action that triggers it', async function (assert) {
      assert.expect(9);

      this.countries = countries;
      this.country = countries[1]; // Spain
      this.didFocusInside = function (select, event) {
        assert.strictEqual(
          typeof select.isOpen,
          'boolean',
          'select.isOpen is a boolean'
        );
        assert.strictEqual(
          typeof select.searchText,
          'string',
          'select.searchText is a string'
        );
        assert.strictEqual(
          typeof select.actions.open,
          'function',
          'select.actions.open is a function'
        );
        assert.strictEqual(
          typeof select.actions.close,
          'function',
          'select.actions.close is a function'
        );
        assert.strictEqual(
          typeof select.actions.reposition,
          'function',
          'select.actions.reposition is a function'
        );
        assert.strictEqual(
          typeof select.actions.search,
          'function',
          'select.actions.search is a function'
        );
        assert.strictEqual(
          typeof select.actions.highlight,
          'function',
          'select.actions.highlight is a function'
        );
        assert.strictEqual(
          typeof select.actions.select,
          'function',
          'select.actions.select is a function'
        );
        assert.ok(
          event instanceof window.Event,
          'The second argument is an event'
        );
      };
      await render(hbs`
      <PowerSelect
        @options={{this.countries}}
        @selected={{this.country}}
        @onChange={{fn (mut this.selected)}}
        @triggerComponent={{component "custom-trigger-that-handles-focus"}}
        @onFocus={{this.didFocusInside}} as |country|>
        {{country.name}}
      </PowerSelect>
    `);

      await focus('#focusable-input');
    });

    test('the search message can be customized passing `@searchMessageComponent`', async function (assert) {
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

    test('the no matches element can be customized passing `@noMatchesMessageComponent`', async function (assert) {
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

    test('placeholder can be customized using `@placeholderComponent`', async function (assert) {
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

    test('`@groupComponent` can be overridden', async function (assert) {
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

    test('`@groupComponent` has extension points', async function (assert) {
      this.groupedNumbers = groupedNumbers;
      let numberOfGroups = 5; // number of groups in groupedNumbers
      assert.expect(4 * numberOfGroups);

      let extra = { foo: 'bar' };
      this.extra = extra;

      this.onInit = function () {
        assert.ok(isPresent(this.select));
        assert.ok(isPresent(this.group.groupName));
        assert.ok(isPresent(this.group.options));
        assert.strictEqual(this.extra, extra);
      };

      await render(hbs`
      <PowerSelect 
        @options={{this.groupedNumbers}} 
        @groupComponent={{component "custom-group-component" onInit=this.onInit}} 
        @extra={{this.extra}}
        @onChange={{fn (mut this.foo)}} as |country|>
        {{country.name}}
      </PowerSelect>
    `);

      await clickTrigger();
    });

    test('the power-select-multiple placeholder can be customized using `@placeholderComponent`', async function (assert) {
      assert.expect(2);

      this.countries = countries;

      await render(hbs`
        <PowerSelectMultiple
          @options={{this.countries}}
          @placeholder="test"
          @placeholderComponent={{component "custom-placeholder"}}
          @onChange={{action (mut this.foo)}} as |country|>
          {{country.name}}
        </PowerSelectMultiple>
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

    test('the power-select-multiple placeholder can be customized using `@placeholderComponent` and work with `@searchEnabled` on `true`', async function (assert) {
      assert.expect(2);

      this.countries = countries;

      await render(hbs`
        <PowerSelectMultiple
          @searchEnabled={{true}}
          @searchField="name"
          @options={{this.countries}}
          @selected={{this.country}}
          @placeholder="test"
          @placeholderComponent={{component "custom-multiple-search-placeholder"}}
          @onChange={{action (mut this.country)}} as |country|>
          {{country.name}}
        </PowerSelectMultiple>
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

    test('the power-select-multiple `optionsComponent` receives the `extra` hash', async function (assert) {
      assert.expect(2);

      this.countries = countries;
      this.country = countries[1]; // Spain

      await render(hbs`
      <PowerSelectMultiple 
        @options={{this.countries}} 
        @selected={{this.country}} 
        @optionsComponent={{component "list-of-countries"}} 
        @onChange={{fn (mut this.foo)}} 
        @extra={{hash field="code"}} as |country|>
        {{country.code}}
      </PowerSelectMultiple>
    `);

      await clickTrigger();

      assert
        .dom('.ember-power-select-options')
        .includesText('Countries:', 'The given component is rendered');
      assert
        .dom('.ember-power-select-options')
        .includesText(
          '3. RU',
          'The component uses the field option in the `extra` hash to render the options'
        );
    });

    test('the power-select-multiple `@triggerComponent` receives the `@extra` hash', async function (assert) {
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

    test('the power-select-multiple `@selectedItemComponent` receives the `extra` hash', async function (assert) {
      assert.expect(1);

      this.countries = countries;
      this.country = [countries[1]]; // Spain

      await render(hbs`
      <div class="select-box">
        <PowerSelectMultiple
            @options={{this.countries}}
            @selected={{this.country}}
            @selectedItemComponent={{component "selected-country"}}
            @onChange={{fn (mut this.selected)}}
            @extra={{hash coolFlagIcon=true}} as |country|>
          {{country.code}}
        </PowerSelectMultiple>
      </div>
    `);

      assert
        .dom('.ember-power-select-trigger .cool-flag-icon')
        .exists(
          { count: 1 },
          'The custom selectedItemComponent renders with the extra.coolFlagIcon.'
        );
    });
  }
);
