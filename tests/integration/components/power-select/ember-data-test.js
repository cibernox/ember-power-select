import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { typeInSearch, clickTrigger } from 'ember-power-select/test-support/helpers';
import { startMirage } from '../../../../initializers/ember-cli-mirage';
import emberDataInitializer from '../../../../initializers/ember-data';
import { find, findAll, click } from 'ember-native-dom-helpers';

module('Integration | Component | Ember Power Select (Ember-data integration)', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    let owner = this.owner;
    startMirage({ environment: 'test', modulePrefix: 'dummy' });
    emberDataInitializer.initialize(owner);
    this.store = owner.lookup('service:store');
  });

  hooks.afterEach(function() {
    server.shutdown();
  });

  test('Passing as options of a `store.findAll` works', async function(assert) {
    server.createList('user', 10);
    server.timing = 200;
    this.users = this.store.findAll('user');
    await render(hbs`
      {{#power-select options=users searchField="name" onchange=(action (mut foo)) as |option|}}
        {{option.name}}
      {{/power-select}}
    `);

    clickTrigger();
    assert.equal(find('.ember-power-select-option').textContent.trim(), 'Loading options...', 'The loading message appears while the promise is pending');

    return settled().then(function() {
      assert.equal(findAll('.ember-power-select-option').length, 10, 'Once the collection resolves the options render normally');
      typeInSearch('2');
      assert.equal(findAll('.ember-power-select-option').length, 1, 'Filtering works');
    });
  });

  test('Passing as options the result of `store.query` works', async function(assert) {
    server.createList('user', 10);
    server.timing = 200;
    this.users = this.store.query('user', { foo: 'bar' });
    await render(hbs`
      {{#power-select options=users searchField="name" onchange=(action (mut foo)) as |option|}}
        {{option.name}}
      {{/power-select}}
    `);

    clickTrigger();
    assert.equal(find('.ember-power-select-option').textContent.trim(), 'Loading options...', 'The loading message appears while the promise is pending');

    return settled().then(function() {
      assert.equal(findAll('.ember-power-select-option').length, 10, 'Once the collection resolves the options render normally');
      typeInSearch('2');
      assert.equal(findAll('.ember-power-select-option').length, 1, 'Filtering works');
    });
  });

  test('Delete an item in a multiple selection', async function(assert) {
    server.createList('user', 10);
    this.users = this.store.findAll('user');
    await render(hbs`
      {{#power-select-multiple options=users searchField="name" selected=users onchange=(action (mut users)) as |option|}}
        {{option.name}}
      {{/power-select-multiple}}
    `);

    return settled().then(function() {
      click('.ember-power-select-multiple-remove-btn');
      return settled().then(function() {
        assert.equal(findAll('.ember-power-select-multiple-remove-btn').length, 9, 'Once the collection resolves the options render normally');
      });
    });
  });
});
