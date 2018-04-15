import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { typeInSearch, clickTrigger } from 'ember-power-select/test-support/helpers';
import emberDataInitializer from '../../../../initializers/ember-data';
import { find, findAll, click } from 'ember-native-dom-helpers';
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
    clickTrigger();
    assert.equal(find('.ember-power-select-option').textContent.trim(), 'Loading options...', 'The loading message appears while the promise is pending');

    return settled().then(function() {
      assert.equal(findAll('.ember-power-select-option').length, 10, 'Once the collection resolves the options render normally');
      typeInSearch('2');
      assert.equal(findAll('.ember-power-select-option').length, 1, 'Filtering works');
    });
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
    clickTrigger();
    assert.equal(find('.ember-power-select-option').textContent.trim(), 'Loading options...', 'The loading message appears while the promise is pending');

    return settled().then(function() {
      assert.equal(findAll('.ember-power-select-option').length, 10, 'Once the collection resolves the options render normally');
      typeInSearch('2');
      assert.equal(findAll('.ember-power-select-option').length, 1, 'Filtering works');
    });
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
    return settled().then(function() {
      click('.ember-power-select-multiple-remove-btn');
      return settled().then(function() {
        assert.equal(findAll('.ember-power-select-multiple-remove-btn').length, 9, 'Once the collection resolves the options render normally');
      });
    });
  });
});
