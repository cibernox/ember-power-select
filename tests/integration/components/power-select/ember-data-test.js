import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled, click, waitFor } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import {
  typeInSearch,
  clickTrigger,
} from 'ember-power-select/test-support/helpers';
import emberDataInitializer from '../../../../initializers/ember-data';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module(
  'Integration | Component | Ember Power Select (Ember-data integration)',
  function (hooks) {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(function () {
      let owner = this.owner;
      emberDataInitializer.initialize(owner);
      this.store = owner.lookup('service:store');
    });

    test('Passing as options of a `store.findAll` works', async function (assert) {
      this.server.createList('user', 10);
      this.server.timing = 200;
      this.users = [];
      await render(hbs`
      <PowerSelect @options={{this.users}} @searchField="name" @onChange={{action (mut this.foo)}} @searchEnabled={{true}} as |option|>
        {{option.name}}
      </PowerSelect>
    `);

      this.set('users', this.store.findAll('user'));
      let promise = clickTrigger();
      await waitFor('.ember-power-select-option');
      assert
        .dom('.ember-power-select-option')
        .hasText(
          'Loading options...',
          'The loading message appears while the promise is pending'
        );
      await promise;
      assert
        .dom('.ember-power-select-option')
        .exists(
          { count: 10 },
          'Once the collection resolves the options render normally'
        );
      await typeInSearch('2');
      assert
        .dom('.ember-power-select-option')
        .exists({ count: 1 }, 'Filtering works');
    });

    test('Passing as options the result of `store.query` works', async function (assert) {
      this.server.createList('user', 10);
      this.server.timing = 200;
      this.users = [];
      await render(hbs`
      <PowerSelect @options={{this.users}} @searchField="name" @onChange={{action (mut this.foo)}} @searchEnabled={{true}} as |option|>
        {{option.name}}
      </PowerSelect>
    `);

      this.set('users', this.store.query('user', { foo: 'bar' }));
      let promise = clickTrigger();
      await waitFor('.ember-power-select-option');
      assert
        .dom('.ember-power-select-option')
        .hasText(
          'Loading options...',
          'The loading message appears while the promise is pending'
        );
      await promise;
      assert
        .dom('.ember-power-select-option')
        .exists(
          { count: 10 },
          'Once the collection resolves the options render normally'
        );
      await typeInSearch('2');
      assert
        .dom('.ember-power-select-option')
        .exists({ count: 1 }, 'Filtering works');
    });

    test('Delete an item in a multiple selection', async function (assert) {
      this.server.createList('user', 10);
      this.users = [];
      await render(hbs`
      <PowerSelectMultiple @options={{this.users}} @searchField="name" @selected={{this.users}} @onChange={{action (mut this.users)}} as |option|>
        {{option.name}}
      </PowerSelectMultiple>
    `);

      this.set('users', this.store.findAll('user'));
      await settled();
      await click('.ember-power-select-multiple-remove-btn');
      assert
        .dom('.ember-power-select-multiple-remove-btn')
        .exists(
          { count: 9 },
          'Once the collection resolves the options render normally'
        );
    });

    test('returning an Ember-data collection from the search works', async function (assert) {
      this.server.createList('user', 10);
      this.server.timing = 0;
      this.selected = undefined;
      this.search = () => {
        return this.store.findAll('user');
      };
      await render(hbs`
      <PowerSelect @selected={{this.selected}} @onChange={{action (mut this.selected)}} @searchEnabled={{true}} @search={{this.search}} as |option|>
        {{option.name}}
      </PowerSelect>
    `);

      await clickTrigger();
      await typeInSearch('anything');
      await click('.ember-power-select-option:nth-child(4)');
      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist('Dropdown is rendered');
      assert
        .dom('.ember-power-select-trigger')
        .hasText('User 3', 'The 4th option was selected');
    });

    test('passing an Ember-data collection to `@selected` of a multiple select works', async function (assert) {
      this.server.createList('user', 10);
      this.server.timing = 0;
      this.options = this.store.findAll('user');
      await this.options;
      this.selected = this.options;
      await render(hbs`
      <PowerSelectMultiple @selected={{this.selected}} @options={{this.options}} @onChange={{action (mut this.selected)}} as |option|>
        {{option.name}}
      </PowerSelectMultiple>
    `);
      assert.dom('.ember-power-select-multiple-option ').exists({ count: 10 });
      assert
        .dom('.ember-power-select-multiple-option:nth-child(4)')
        .containsText('User 3');
      await clickTrigger();
      assert.dom('.ember-power-select-option').exists({ count: 10 });
      await click('.ember-power-select-option:nth-child(4)');
      assert.dom('.ember-power-select-multiple-option').exists({ count: 9 });
      assert
        .dom('.ember-power-select-multiple-option:nth-child(4)')
        .containsText(
          'User 4',
          'The 4th selected option is not User 3 anymore'
        );
    });
  }
);
