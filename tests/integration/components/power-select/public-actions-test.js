import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { triggerKeydown, clickTrigger } from '../../../helpers/ember-power-select';
import { numbers } from '../constants';


moduleForComponent('ember-power-select', 'Integration | Component | Ember Power Select (Public actions)', {
  integration: true
});

test('The onchange of single selects action receives the selection and the public API', function(assert) {
  assert.expect(8);

  this.numbers = numbers;
  this.handleChange = (selected, select) => {
    assert.equal(selected, 'one', 'The first option is the selected');
    assert.equal(typeof select.isOpen, 'boolean', 'select.isOpen is a boolean');
    assert.equal(typeof select.highlighted, 'string', 'select.highlighted is a string');
    assert.equal(typeof select.actions.open, 'function', 'select.actions.open is a function');
    assert.equal(typeof select.actions.close, 'function', 'select.actions.close is a function');
    assert.equal(typeof select.actions.search, 'function', 'select.actions.search is a function');
    assert.equal(typeof select.actions.highlight, 'function', 'select.actions.highlight is a function');
    assert.equal(typeof select.actions.select, 'function', 'select.actions.select is a function');
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
  assert.expect(8);

  this.numbers = numbers;
  this.handleChange = (selected, select) => {
    assert.equal(selected, 'one', 'The first option is the selected');
    assert.equal(typeof select.isOpen, 'boolean', 'select.isOpen is a boolean');
    assert.equal(typeof select.highlighted, 'string', 'select.highlighted is a string');
    assert.equal(typeof select.actions.open, 'function', 'select.actions.open is a function');
    assert.equal(typeof select.actions.close, 'function', 'select.actions.close is a function');
    assert.equal(typeof select.actions.search, 'function', 'select.actions.search is a function');
    assert.equal(typeof select.actions.highlight, 'function', 'select.actions.highlight is a function');
    assert.equal(typeof select.actions.select, 'function', 'select.actions.select is a function');
  };

  this.render(hbs`
    {{#power-select-multiple options=numbers selected=foo onchange=handleChange as |number|}}
      {{number}}
    {{/power-select-multiple}}
  `);

  clickTrigger();
  Ember.run(() => $('.ember-power-select-option:eq(0)').mouseup());
});

test('The onkeydown of single selects action receives the public API and the keydown event', function(assert) {
  assert.expect(8);

  this.numbers = numbers;
  this.onKeyDown = (select, e) => {
    assert.equal(typeof select.isOpen, 'boolean', 'select.isOpen is a boolean');
    assert.equal(typeof select.highlighted, 'undefined', 'select.highlighted is a still undefined');
    assert.equal(typeof select.actions.open, 'function', 'select.actions.open is a function');
    assert.equal(typeof select.actions.close, 'function', 'select.actions.close is a function');
    assert.equal(typeof select.actions.search, 'function', 'select.actions.search is a function');
    assert.equal(typeof select.actions.highlight, 'function', 'select.actions.highlight is a function');
    assert.equal(typeof select.actions.select, 'function', 'select.actions.select is a function');
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

test('The onkeydown can be used to easily allow to select on tab', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.onKeyDown = (select, e) => {
    if (e.keyCode === 9) {
      select.actions.select(select.highlighted);
      select.actions.close();
    }
  };

  this.render(hbs`
    {{#power-select options=numbers selected=foo onkeydown=onKeyDown onchange=(action (mut foo)) as |number|}}
      {{number}}
    {{/power-select}}
  `);

  clickTrigger();
  triggerKeydown($('.ember-power-select-trigger')[0], 40);
  triggerKeydown($('.ember-power-select-trigger')[0], 40);
  triggerKeydown($('.ember-power-select-trigger')[0], 9);
  assert.equal(this.$('.ember-power-select-trigger').text().trim(), 'three', 'The highlighted options has been selected');
  assert.equal($('.ember-power-select-options').length, 0, 'The select is closed');
});

test('The onkeydown of multiple selects action receives the public API and the keydown event', function(assert) {
  assert.expect(8);

  this.numbers = numbers;
  this.onKeyDown = (select, e) => {
    assert.equal(typeof select.isOpen, 'boolean', 'select.isOpen is a boolean');
    assert.equal(typeof select.highlighted, 'string', 'select.highlighted is a string');
    assert.equal(typeof select.actions.open, 'function', 'select.actions.open is a function');
    assert.equal(typeof select.actions.close, 'function', 'select.actions.close is a function');
    assert.equal(typeof select.actions.search, 'function', 'select.actions.search is a function');
    assert.equal(typeof select.actions.highlight, 'function', 'select.actions.highlight is a function');
    assert.equal(typeof select.actions.select, 'function', 'select.actions.select is a function');
    assert.ok(e instanceof window.Event, 'The second argument is an event');
  };

  this.render(hbs`
    {{#power-select-multiple options=numbers selected=foo onkeydown=onKeyDown onchange=(action (mut foo)) as |number|}}
      {{number}}
    {{/power-select-multiple}}
  `);

  clickTrigger();
  triggerKeydown($('.ember-power-select-trigger-multiple-input')[0], 13);
});

test('The onfocus of single selects action receives the public API and the focus event', function(assert) {
  assert.expect(9);

  this.numbers = numbers;
  this.handleFocus = (select, e) => {
    assert.equal(typeof select.isOpen, 'boolean', 'select.isOpen is a boolean');
    assert.equal(typeof select.highlighted, 'string', 'select.highlighted is a string');
    assert.equal(typeof select.actions.open, 'function', 'select.actions.open is a function');
    assert.equal(typeof select.actions.close, 'function', 'select.actions.close is a function');
    assert.equal(typeof select.actions.reposition, 'function', 'select.actions.reposition is a function');
    assert.equal(typeof select.actions.search, 'function', 'select.actions.search is a function');
    assert.equal(typeof select.actions.highlight, 'function', 'select.actions.highlight is a function');
    assert.equal(typeof select.actions.select, 'function', 'select.actions.select is a function');
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
  assert.expect(9);

  this.numbers = numbers;
  this.handleFocus = (select, e) => {
    assert.equal(typeof select.isOpen, 'boolean', 'select.isOpen is a boolean');
    assert.equal(typeof select.highlighted, 'string', 'select.highlighted is a string');
    assert.equal(typeof select.actions.open, 'function', 'select.actions.open is a function');
    assert.equal(typeof select.actions.close, 'function', 'select.actions.close is a function');
    assert.equal(typeof select.actions.reposition, 'function', 'select.actions.reposition is a function');
    assert.equal(typeof select.actions.search, 'function', 'select.actions.search is a function');
    assert.equal(typeof select.actions.highlight, 'function', 'select.actions.highlight is a function');
    assert.equal(typeof select.actions.select, 'function', 'select.actions.select is a function');
    assert.ok(e instanceof window.Event, 'The second argument is an event');
  };

  this.render(hbs`
    {{#power-select-multiple options=numbers selected=foo onfocus=handleFocus onchange=(action (mut foo)) as |number|}}
      {{number}}
    {{/power-select-multiple}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').focus());
});

test('the `onopen` action is invoked when the dropdown opens', function(assert) {
  assert.expect(10);

  this.numbers = numbers;
  this.handleOpen = (select, e) => {
    assert.equal(typeof select.isOpen, 'boolean', 'select.isOpen is a boolean');
    assert.equal(typeof select.highlighted, 'string', 'select.highlighted is a string');
    assert.equal(typeof select.actions.open, 'function', 'select.actions.open is a function');
    assert.equal(typeof select.actions.close, 'function', 'select.actions.close is a function');
    assert.equal(typeof select.actions.reposition, 'function', 'select.actions.reposition is a function');
    assert.equal(typeof select.actions.search, 'function', 'select.actions.search is a function');
    assert.equal(typeof select.actions.highlight, 'function', 'select.actions.highlight is a function');
    assert.equal(typeof select.actions.select, 'function', 'select.actions.select is a function');
    assert.ok(e instanceof window.Event, 'The second argument is an event');
  };

  this.render(hbs`
    {{#power-select options=numbers onchange=(action (mut foo)) onopen=handleOpen as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-dropdown').length, 1, 'Dropdown is opened');
});

test('the `onclose` action is invoked when the dropdown closes', function(assert) {
  assert.expect(7);

  this.numbers = numbers;
  this.handleClose = (select, e) => {
    assert.equal(typeof select.isOpen, 'boolean', 'select.isOpen is a boolean');
    assert.equal(typeof select.actions.open, 'function', 'select.actions.open is a function');
    assert.equal(typeof select.actions.close, 'function', 'select.actions.close is a function');
    assert.equal(typeof select.actions.search, 'function', 'select.actions.search is a function');
    assert.equal(typeof select.actions.highlight, 'function', 'select.actions.highlight is a function');
    assert.ok(e instanceof window.Event, 'The second argument is an event');
  };

  this.render(hbs`
    {{#power-select options=numbers onchange=(action (mut foo)) onclose=handleClose as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  clickTrigger();
  assert.equal($('.ember-power-select-dropdown').length, 0, 'Dropdown is closed');
});

test('the `search` action of the public api passed to the public actions works as expected', function(assert) {
  assert.expect(6);

  this.handleSearch = (term) => {
    assert.equal(term, 'abc', 'The search term receives `abc`');
    return ['foo', 'bar', 'baz'];
  };
  this.handleOpen = (select) => {
    select.actions.search('abc');
  };
  this.render(hbs`
    {{#power-select onchange=(action (mut foo)) onopen=handleOpen search=handleSearch as |option|}}
      {{option}}
    {{/power-select}}
  `);
  clickTrigger();
  assert.equal($('.ember-power-select-search input')[0].value, 'abc');
  assert.equal($('.ember-power-select-option').length, 3, 'There is three options');
  assert.equal($('.ember-power-select-option:eq(0)').text().trim(), 'foo');
  assert.equal($('.ember-power-select-option:eq(1)').text().trim(), 'bar');
  assert.equal($('.ember-power-select-option:eq(2)').text().trim(), 'baz');
});

test('the `highlight` action of the public api passed to the public actions works as expected', function(assert) {
  assert.expect(2);
  this.options = ['foo', 'bar', 'baz'];
  this.handleOpen = (select) => {
    select.actions.highlight('baz');
  };
  this.render(hbs`
    {{#power-select options=options onchange=(action (mut foo)) onopen=handleOpen as |option|}}
      {{option}}
    {{/power-select}}
  `);
  clickTrigger();
  assert.equal($('.ember-power-select-option').length, 3, 'There is three options');
  assert.equal($('.ember-power-select-option[aria-current="true"]').text().trim(), 'baz', 'The third option is highlighted');
});

test('The programmer can use the received public API to perform searches in single selects', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.initSearch = (select) => {
    assert.ok(true, 'The onopen action is fired');
    select.actions.search('hello');
  };

  this.render(hbs`
    {{#power-select options=numbers selected=foo onopen=initSearch onchange=(action (mut foo)) as |number|}}
      {{number}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-search input')[0].value, 'hello', 'The search text contains the searched string');
});

test('The programmer can use the received public API to perform searches in mutiple selects', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.initSearch = (select) => {
    assert.ok(true, 'The onopen action is fired');
    select.actions.search('hello');
  };

  this.render(hbs`
    {{#power-select-multiple options=numbers selected=foo onopen=initSearch onchange=(action (mut foo)) as |number|}}
      {{number}}
    {{/power-select-multiple}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-trigger-multiple-input')[0].value, 'hello', 'The search text contains the searched string');
});
