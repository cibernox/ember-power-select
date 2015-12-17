import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { triggerKeydown, clickTrigger } from '../../../helpers/ember-power-select';
import { numbers } from '../constants';


moduleForComponent('ember-power-select', 'Integration | Component | Ember Power Select (Public actions)', {
  integration: true
});

test('The onchange of single selects action receives the selection and the public API', function(assert) {
  assert.expect(7);

  this.numbers = numbers;
  this.handleChange = (selection, select) => {
    assert.equal(selection, 'one', 'The first option is the selection');
    assert.equal(typeof select.isOpen, 'boolean', 'select.isOpen is a boolean');
    assert.equal(typeof select.actions.open, 'function', 'select.actions.open is a function');
    assert.equal(typeof select.actions.close, 'function', 'select.actions.close is a function');
    assert.equal(typeof select.actions.toggle, 'function', 'select.actions.toggle is a function');
    assert.equal(typeof select.actions.search, 'function', 'select.actions.search is a function');
    assert.equal(typeof select.actions.highlight, 'function', 'select.actions.highlight is a function');
  };

  this.render(hbs`
    {{#power-select options=numbers selected=foo onchange=handleChange as |number|}}
      {{number}}
    {{/power-select}}
  `);

  clickTrigger();
  Ember.run(() => $('.ember-power-select-option:eq(0)').mouseup());
});

test('The onchange of multiple selects action receives the selection and the public API', function(assert) {
  assert.expect(7);

  this.numbers = numbers;
  this.handleChange = (selection, select) => {
    assert.equal(selection, 'one', 'The first option is the selection');
    assert.equal(typeof select.isOpen, 'boolean', 'select.isOpen is a boolean');
    assert.equal(typeof select.actions.open, 'function', 'select.actions.open is a function');
    assert.equal(typeof select.actions.close, 'function', 'select.actions.close is a function');
    assert.equal(typeof select.actions.toggle, 'function', 'select.actions.toggle is a function');
    assert.equal(typeof select.actions.search, 'function', 'select.actions.search is a function');
    assert.equal(typeof select.actions.highlight, 'function', 'select.actions.highlight is a function');
  };

  this.render(hbs`
    {{#power-select multiple=true options=numbers selected=foo onchange=handleChange as |number|}}
      {{number}}
    {{/power-select}}
  `);

  clickTrigger();
  Ember.run(() => $('.ember-power-select-option:eq(0)').mouseup());
});

test('The onkeydown of single selects action receives the public API and the keydown event', function(assert) {
  assert.expect(7);

  this.numbers = numbers;
  this.onKeyDown = (select, e) => {
    assert.equal(typeof select.isOpen, 'boolean', 'select.isOpen is a boolean');
    assert.equal(typeof select.actions.open, 'function', 'select.actions.open is a function');
    assert.equal(typeof select.actions.close, 'function', 'select.actions.close is a function');
    assert.equal(typeof select.actions.toggle, 'function', 'select.actions.toggle is a function');
    assert.equal(typeof select.actions.search, 'function', 'select.actions.search is a function');
    assert.equal(typeof select.actions.highlight, 'function', 'select.actions.highlight is a function');
    assert.ok(e instanceof window.Event, 'The second argument is an event');
  };

  this.render(hbs`
    {{#power-select options=numbers selected=foo onkeydown=onKeyDown onchange=(action (mut foo)) as |number|}}
      {{number}}
    {{/power-select}}
  `);

  clickTrigger();
  triggerKeydown($('.ember-power-select-search input')[0], 13);
});

test('The onkeydown of multiple selects action receives the public API and the keydown event', function(assert) {
  assert.expect(7);

  this.numbers = numbers;
  this.onKeyDown = (select, e) => {
    assert.equal(typeof select.isOpen, 'boolean', 'select.isOpen is a boolean');
    assert.equal(typeof select.actions.open, 'function', 'select.actions.open is a function');
    assert.equal(typeof select.actions.close, 'function', 'select.actions.close is a function');
    assert.equal(typeof select.actions.toggle, 'function', 'select.actions.toggle is a function');
    assert.equal(typeof select.actions.search, 'function', 'select.actions.search is a function');
    assert.equal(typeof select.actions.highlight, 'function', 'select.actions.highlight is a function');
    assert.ok(e instanceof window.Event, 'The second argument is an event');
  };

  this.render(hbs`
    {{#power-select multiple=true options=numbers selected=foo onkeydown=onKeyDown onchange=(action (mut foo)) as |number|}}
      {{number}}
    {{/power-select}}
  `);

  clickTrigger();
  triggerKeydown($('.ember-power-select-trigger-multiple-input')[0], 13);
});

test('The onfocus of single selects action receives the public API and the focus event', function(assert) {
  assert.expect(7);

  this.numbers = numbers;
  this.handleFocus = (select, e) => {
    assert.equal(typeof select.isOpen, 'boolean', 'select.isOpen is a boolean');
    assert.equal(typeof select.actions.open, 'function', 'select.actions.open is a function');
    assert.equal(typeof select.actions.close, 'function', 'select.actions.close is a function');
    assert.equal(typeof select.actions.toggle, 'function', 'select.actions.toggle is a function');
    assert.equal(typeof select.actions.search, 'function', 'select.actions.search is a function');
    assert.equal(typeof select.actions.highlight, 'function', 'select.actions.highlight is a function');
    assert.ok(e instanceof window.Event, 'The second argument is an event');
  };

  this.render(hbs`
    {{#power-select options=numbers selected=foo onfocus=handleFocus onchange=(action (mut foo)) as |number|}}
      {{number}}
    {{/power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').focus());
});

test('The onfocus of multiple selects action receives the public API and the focus event', function(assert) {
  assert.expect(7);

  this.numbers = numbers;
  this.handleFocus = (select, e) => {
    assert.equal(typeof select.isOpen, 'boolean', 'select.isOpen is a boolean');
    assert.equal(typeof select.actions.open, 'function', 'select.actions.open is a function');
    assert.equal(typeof select.actions.close, 'function', 'select.actions.close is a function');
    assert.equal(typeof select.actions.toggle, 'function', 'select.actions.toggle is a function');
    assert.equal(typeof select.actions.search, 'function', 'select.actions.search is a function');
    assert.equal(typeof select.actions.highlight, 'function', 'select.actions.highlight is a function');
    assert.ok(e instanceof window.Event, 'The second argument is an event');
  };

  this.render(hbs`
    {{#power-select multiple=true options=numbers selected=foo onfocus=handleFocus onchange=(action (mut foo)) as |number|}}
      {{number}}
    {{/power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').focus());
});

test('then `onopen` action is invoked after the dropdown opens', function(assert) {
  assert.expect(8);

  this.numbers = numbers;
  this.handleOpen = (select, e) => {
    assert.equal(typeof select.isOpen, 'boolean', 'select.isOpen is a boolean');
    assert.equal(typeof select.actions.open, 'function', 'select.actions.open is a function');
    assert.equal(typeof select.actions.close, 'function', 'select.actions.close is a function');
    assert.equal(typeof select.actions.toggle, 'function', 'select.actions.toggle is a function');
    assert.equal(typeof select.actions.search, 'function', 'select.actions.search is a function');
    assert.equal(typeof select.actions.highlight, 'function', 'select.actions.highlight is a function');
    assert.ok(e instanceof window.Event, 'The second argument is an event');
  };

  this.render(hbs`
    {{#power-select options=numbers onchange=(action (mut foo)) onopen=handleOpen as |option|}}
      {{option}}
    {{/power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').mousedown());
  assert.equal($('.ember-power-select-dropdown').length, 1, 'Dropdown is opened');
});