import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { countries } from '../constants';
import { groupedNumbers } from '../constants';
import { clickTrigger } from 'ember-power-select/test-support/helpers';
import Component from '@ember/component';

module(
  'Integration | Component | Ember Power Select (Customization with overwriting components)',
  function (hooks) {
    setupRenderingTest(hooks);

    test('overwriting `power-select/trigger` works', async function (assert) {
      assert.expect(3);

      this.owner.register(
        'component:power-select/trigger',
        class extends Component {
          layout = hbs`
        <img 
          src={{@select.selected.flagUrl}} 
          class="icon-flag {{if @extra.coolFlagIcon "cool-flag-icon"}}" 
          alt="Flag of {{@select.selected.name}}"
        >
        {{@select.selected.name}}
      `;
        }
      );

      this.countries = countries;
      this.country = countries[1]; // Spain

      await render(hbs`
      <PowerSelect 
        @options={{this.countries}} 
        @selected={{this.country}} 
        @onChange={{action (mut this.foo)}} as |country|>
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
      this.owner.register(
        'component:power-select/options',
        Component.extend({
          layout: hbs`
        <p>Countries:</p>
        <ul>
          {{#if @extra.field}}
            {{#each @options as |option index|}}
              <li>{{index}}. {{get option @extra.field}}</li>
            {{/each}}
          {{else}}
            {{#each @options as |option index|}}
              <li>{{index}}. {{option.name}}</li>
            {{/each}}
          {{/if}}
        </ul>
      `,
        })
      );
      this.countries = countries;
      this.country = countries[1]; // Spain

      await render(hbs`
      <PowerSelect 
        @options={{this.countries}} 
        @selected={{this.country}} 
        @onChange={{action (mut this.foo)}} as |country|>
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
      this.owner.register(
        'component:power-select/before-options',
        Component.extend({
          layout: hbs`
        <p id="custom-before-options-p-tag">{{@placeholder}}</p>
        {{component (ensure-safe-component @placeholderComponent) placeholder=@placeholder}}
      `,
        })
      );
      this.countries = countries;
      this.country = countries[1]; // Spain

      await render(hbs`
      <PowerSelect
        @options={{this.countries}}
        @selected={{this.country}}
        @placeholder="inception"
        @onChange={{action (mut this.foo)}} as |country|>
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
      this.owner.register(
        'component:power-select/search-message',
        Component.extend({
          layout: hbs`<p id="custom-search-message-p-tag">Customized seach message!</p>`,
        })
      );
      this.searchFn = function () {};
      await render(hbs`
      <PowerSelect 
        @search={{this.searchFn}} 
        @onChange={{action (mut this.foo)}} as |country|>
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

      this.owner.register(
        'component:power-select/no-matches-message',
        Component.extend({
          layout: hbs`<p id="custom-no-matches-message-p-tag">{{@noMatchesMessage}}</p>`,
        })
      );

      this.options = [];

      await render(hbs`
      <PowerSelect 
        @options={{this.options}} 
        @noMatchesMessage="Nope" 
        @onChange={{action (mut this.foo)}} as |option|>
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
      this.owner.register(
        'component:power-select/placeholder',
        Component.extend({
          layout: hbs`
        <div class="ember-power-select-placeholder">
          This is a very <span style="font-weight:bold">bold</span> placeholder
        </div>
      `,
        })
      );
      this.countries = countries;

      await render(hbs`
      <PowerSelect
        @options={{this.countries}}
        @placeholder="test"
        @onChange={{action (mut this.foo)}} as |country|>
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

      this.owner.register(
        'component:power-select/power-select-group',
        Component.extend({
          layout: hbs`<div class="custom-component">{{yield}}</div>`,
        })
      );

      await render(hbs`
      <PowerSelect 
        @options={{this.groupedNumbers}} 
        @onChange={{action (mut this.foo)}} as |country|>
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
      this.owner.register(
        'component:power-select-multiple/trigger',
        Component.extend({
          layout: hbs`
        <img 
          src={{@select.selected.flagUrl}} 
          class="icon-flag {{if @extra.coolFlagIcon "cool-flag-icon"}}" 
          alt="Flag of {{@select.selected.name}}"
        >
        {{@select.selected.name}}
      `,
        })
      );
      this.countries = countries;
      this.country = countries[1]; // Spain

      await render(hbs`
      <PowerSelectMultiple 
        @options={{this.countries}}
        @selected={{this.country}} 
        @onChange={{action (mut this.foo)}} 
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
