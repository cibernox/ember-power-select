import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import wait from 'ember-test-helpers/wait';
import hbs from 'htmlbars-inline-precompile';
import { typeInSearch, clickTrigger } from '../../../helpers/ember-power-select';
import { startMirage } from '../../../../initializers/ember-cli-mirage';
import emberDataInitializer from '../../../../initializers/ember-data';
import { find, findAll, click } from 'ember-native-dom-helpers';

moduleForComponent('ember-power-select', 'Integration | Component | Ember Power Select (Ember-data integration)', {
  integration: true,
  beforeEach() {
    let owner = Ember.getOwner(this);
    startMirage({ environment: 'test', modulePrefix: 'dummy' });
    emberDataInitializer.initialize(owner);
    this.store = owner.lookup('service:store');
  },

  afterEach() {
    server.shutdown();
  }
});

test('Passing as options of a `store.findAll` works', function(assert) {
  server.createList('user', 10);
  this.users = this.store.findAll('user');
  this.render(hbs`
    {{#power-select options=users searchField="name" onchange=(action (mut foo)) as |option|}}
      {{option.name}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal(find('.ember-power-select-option').textContent.trim(), 'Loading options...', 'The loading message appears while the promise is pending');

  return wait().then(function() {
    assert.equal(findAll('.ember-power-select-option').length, 10, 'Once the collection resolves the options render normally');
    typeInSearch('2');
    assert.equal(findAll('.ember-power-select-option').length, 1, 'Filtering works');
  });
});

test('Passing as options the result of `store.query` works', function(assert) {
  server.createList('user', 10);
  this.users = this.store.query('user', { foo: 'bar' });
  this.render(hbs`
    {{#power-select options=users searchField="name" onchange=(action (mut foo)) as |option|}}
      {{option.name}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal(find('.ember-power-select-option').textContent.trim(), 'Loading options...', 'The loading message appears while the promise is pending');

  return wait().then(function() {
    assert.equal(findAll('.ember-power-select-option').length, 10, 'Once the collection resolves the options render normally');
    typeInSearch('2');
    assert.equal(findAll('.ember-power-select-option').length, 1, 'Filtering works');
  });
});

test('Delete an item in a multiple selection', function(assert) {
  server.createList('user', 10);
  this.users = this.store.findAll('user');
  this.render(hbs`
    {{#power-select-multiple options=users searchField="name" selected=users onchange=(action (mut users)) as |option|}}
      {{option.name}}
    {{/power-select-multiple}}
  `);

  return wait().then(function() {
    click('.ember-power-select-multiple-remove-btn');
    return wait().then(function() {
      assert.equal(findAll('.ember-power-select-multiple-remove-btn').length, 9, 'Once the collection resolves the options render normally');
    });
  });
});
