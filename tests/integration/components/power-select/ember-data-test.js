import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled, click, waitFor } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { typeInSearch, clickTrigger } from 'ember-power-select/test-support/helpers';
import emberDataInitializer from '../../../../initializers/ember-data';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Integration | Component | Ember Power Select (Ember-data integration)', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function() {
    let owner = this.owner;
    emberDataInitializer.initialize(owner);
    this.store = owner.lookup('service:store');
  });

  test('Passing as options of a `store.findAll` works', async function(assert) {
    this.server.createList('user', 10);
    this.server.timing = 200;
    this.users = [];
    await render(hbs`
      {{#power-select options=users searchField="name" onchange=(action (mut foo)) as |option|}}
        {{option.name}}
      {{/power-select}}
    `);

    this.set('users', this.store.findAll('user'));
    let promise = clickTrigger();
    await waitFor('.ember-power-select-option');
    assert.dom('.ember-power-select-option').hasText('Loading options...', 'The loading message appears while the promise is pending');
    await promise;
    assert.dom('.ember-power-select-option').exists({ count: 10 }, 'Once the collection resolves the options render normally');
    await typeInSearch('2');
    assert.dom('.ember-power-select-option').exists({ count: 1 }, 'Filtering works');
  });

  test('Passing as options the result of `store.query` works', async function(assert) {
    this.server.createList('user', 10);
    this.server.timing = 200;
    this.users = [];
    await render(hbs`
      {{#power-select options=users searchField="name" onchange=(action (mut foo)) as |option|}}
        {{option.name}}
      {{/power-select}}
    `);

    this.set('users', this.store.query('user', { foo: 'bar' }));
    let promise = clickTrigger();
    await waitFor('.ember-power-select-option');
    assert.dom('.ember-power-select-option').hasText('Loading options...', 'The loading message appears while the promise is pending')
    await promise;
    assert.dom('.ember-power-select-option').exists({ count: 10 }, 'Once the collection resolves the options render normally');
    await typeInSearch('2');
    assert.dom('.ember-power-select-option').exists({ count: 1 }, 'Filtering works');
  });

  test('Delete an item in a multiple selection', async function(assert) {
    this.server.createList('user', 10);
    this.users = [];
    await render(hbs`
      {{#power-select-multiple options=users searchField="name" selected=users onchange=(action (mut users)) as |option|}}
        {{option.name}}
      {{/power-select-multiple}}
    `);

    this.set('users', this.store.findAll('user'));
    await settled()
    await click('.ember-power-select-multiple-remove-btn');
    assert.dom('.ember-power-select-multiple-remove-btn').exists({ count: 9 }, 'Once the collection resolves the options render normally');
  });
});
