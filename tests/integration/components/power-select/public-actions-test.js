import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { triggerKeydown, clickTrigger, typeInSearch, nativeMouseUp } from '../../../helpers/ember-power-select';
import { numbers } from '../constants';


moduleForComponent('ember-power-select', 'Integration | Component | Ember Power Select (Public actions)', {
  integration: true
});

test('The search action of single selects action receives the search term and the public API', function(assert) {
  assert.expect(10);

  this.numbers = numbers;
  this.handleSearch = (term, select) => {
    assert.equal(term, 'el', 'The search term is received as 1st argument');
    assert.equal(typeof select.isOpen, 'boolean', 'select.isOpen is a boolean');
    assert.equal(typeof select.highlighted, 'string', 'select.highlighted is a string');
    assert.equal(typeof select.searchText, 'string', 'select.searchText is a string');
    assert.equal(typeof select.actions.open, 'function', 'select.actions.open is a function');
    assert.equal(typeof select.actions.close, 'function', 'select.actions.close is a function');
    assert.equal(typeof select.actions.reposition, 'function', 'select.actions.reposition is a function');
    assert.equal(typeof select.actions.search, 'function', 'select.actions.search is a function');
    assert.equal(typeof select.actions.highlight, 'function', 'select.actions.highlight is a function');
    assert.equal(typeof select.actions.select, 'function', 'select.actions.select is a function');
  };

  this.render(hbs`
    {{#power-select options=numbers selected=foo onchange=(action (mut foo)) search=handleSearch as |number|}}
      {{number}}
    {{/power-select}}
  `);

  clickTrigger();
  typeInSearch('el');
});

test('The search action of multiple selects action receives the search term and the public API', function(assert) {
  assert.expect(10);

  this.numbers = numbers;
  this.handleSearch = (term, select) => {
    assert.equal(term, 'el', 'The search term is received as 1st argument');
    assert.equal(typeof select.isOpen, 'boolean', 'select.isOpen is a boolean');
    assert.equal(typeof select.highlighted, 'string', 'select.highlighted is a string');
    assert.equal(typeof select.searchText, 'string', 'select.searchText is a string');
    assert.equal(typeof select.actions.open, 'function', 'select.actions.open is a function');
    assert.equal(typeof select.actions.close, 'function', 'select.actions.close is a function');
    assert.equal(typeof select.actions.reposition, 'function', 'select.actions.reposition is a function');
    assert.equal(typeof select.actions.search, 'function', 'select.actions.search is a function');
    assert.equal(typeof select.actions.highlight, 'function', 'select.actions.highlight is a function');
    assert.equal(typeof select.actions.select, 'function', 'select.actions.select is a function');
  };

  this.render(hbs`
    {{#power-select-multiple options=numbers selected=foo onchange=(action (mut foo)) search=handleSearch as |number|}}
      {{number}}
    {{/power-select-multiple}}
  `);

  clickTrigger();
  typeInSearch('el');
});

test('The onchange of single selects action receives the selection and the public API', function(assert) {
  assert.expect(10);

  this.numbers = numbers;
  this.handleChange = (selected, select) => {
    assert.equal(selected, 'one', 'The first option is the selected');
    assert.equal(typeof select.isOpen, 'boolean', 'select.isOpen is a boolean');
    assert.equal(typeof select.highlighted, 'string', 'select.highlighted is a string');
    assert.equal(typeof select.searchText, 'string', 'select.searchText is a string');
    assert.equal(typeof select.actions.open, 'function', 'select.actions.open is a function');
    assert.equal(typeof select.actions.close, 'function', 'select.actions.close is a function');
    assert.equal(typeof select.actions.reposition, 'function', 'select.actions.reposition is a function');
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
  nativeMouseUp('.ember-power-select-option:eq(0)');
});

test('The onchange of multiple selects action receives the selection and the public API', function(assert) {
  assert.expect(10);

  this.numbers = numbers;
  this.handleChange = (selected, select) => {
    assert.equal(selected, 'one', 'The first option is the selected');
    assert.equal(typeof select.isOpen, 'boolean', 'select.isOpen is a boolean');
    assert.equal(typeof select.highlighted, 'string', 'select.highlighted is a string');
    assert.equal(typeof select.searchText, 'string', 'select.searchText is a string');
    assert.equal(typeof select.actions.open, 'function', 'select.actions.open is a function');
    assert.equal(typeof select.actions.close, 'function', 'select.actions.close is a function');
    assert.equal(typeof select.actions.reposition, 'function', 'select.actions.reposition is a function');
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
  nativeMouseUp('.ember-power-select-option:eq(0)');
});

test('The onkeydown of single selects action receives the public API and the keydown event', function(assert) {
  assert.expect(10);

  this.numbers = numbers;
  this.onKeyDown = (select, e) => {
    assert.equal(typeof select.isOpen, 'boolean', 'select.isOpen is a boolean');
    assert.equal(typeof select.highlighted, 'string', 'select.highlighted is a string');
    assert.equal(typeof select.searchText, 'string', 'select.searchText is a string');
    assert.equal(typeof select.actions.open, 'function', 'select.actions.open is a function');
    assert.equal(typeof select.actions.close, 'function', 'select.actions.close is a function');
    assert.equal(typeof select.actions.reposition, 'function', 'select.actions.reposition is a function');
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
  assert.expect(10);

  this.numbers = numbers;
  this.onKeyDown = (select, e) => {
    assert.equal(typeof select.isOpen, 'boolean', 'select.isOpen is a boolean');
    assert.equal(typeof select.highlighted, 'string', 'select.highlighted is a string');
    assert.equal(typeof select.searchText, 'string', 'select.searchText is a string');
    assert.equal(typeof select.actions.open, 'function', 'select.actions.open is a function');
    assert.equal(typeof select.actions.close, 'function', 'select.actions.close is a function');
    assert.equal(typeof select.actions.reposition, 'function', 'select.actions.reposition is a function');
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

test('returning false from the `onkeydown` action prevents the default behaviour in single selects', function(assert) {
  assert.expect(11);

  this.numbers = numbers;
  this.handleKeyDown = (select, e) => {
    assert.equal(select.isOpen, false, 'select.isOpen is still false');
    assert.equal(typeof select.highlighted, 'string', 'select.highlighted is a string');
    assert.equal(typeof select.searchText, 'string', 'select.searchText is a string');
    assert.equal(typeof select.actions.open, 'function', 'select.actions.open is a function');
    assert.equal(typeof select.actions.close, 'function', 'select.actions.close is a function');
    assert.equal(typeof select.actions.reposition, 'function', 'select.actions.reposition is a function');
    assert.equal(typeof select.actions.search, 'function', 'select.actions.search is a function');
    assert.equal(typeof select.actions.highlight, 'function', 'select.actions.highlight is a function');
    assert.equal(typeof select.actions.select, 'function', 'select.actions.select is a function');
    assert.ok(e instanceof window.Event, 'The second argument is an event');
    return false;
  };

  this.render(hbs`
    {{#power-select options=numbers selected=foo onchange=(action (mut foo)) onkeydown=handleKeyDown as |option|}}
      {{option}}
    {{/power-select}}
  `);

  triggerKeydown($('.ember-power-select-trigger')[0], 13);
  assert.equal($('.ember-power-select-dropdown').length, 0, 'Dropdown is still closed');
});

test('returning false from the `onkeydown` action prevents the default behaviour in multiple selects', function(assert) {
  assert.expect(11);

  this.numbers = numbers;
  this.handleKeyDown = (select, e) => {
    assert.equal(select.isOpen, false, 'select.isOpen is still false');
    assert.equal(typeof select.highlighted, 'string', 'select.highlighted is a string');
    assert.equal(typeof select.searchText, 'string', 'select.searchText is a string');
    assert.equal(typeof select.actions.open, 'function', 'select.actions.open is a function');
    assert.equal(typeof select.actions.close, 'function', 'select.actions.close is a function');
    assert.equal(typeof select.actions.reposition, 'function', 'select.actions.reposition is a function');
    assert.equal(typeof select.actions.search, 'function', 'select.actions.search is a function');
    assert.equal(typeof select.actions.highlight, 'function', 'select.actions.highlight is a function');
    assert.equal(typeof select.actions.select, 'function', 'select.actions.select is a function');
    assert.ok(e instanceof window.Event, 'The second argument is an event');
    return false;
  };

  this.render(hbs`
    {{#power-select-multiple options=numbers selected=foo onchange=(action (mut foo)) onkeydown=handleKeyDown as |option|}}
      {{option}}
    {{/power-select-multiple}}
  `);

  triggerKeydown($('.ember-power-select-trigger-multiple-input')[0], 13);
  assert.equal($('.ember-power-select-dropdown').length, 0, 'Dropdown is still closed');
});

test('The onfocus of single selects action receives the public API and the focus event', function(assert) {
  assert.expect(10);

  this.numbers = numbers;
  this.handleFocus = (select, e) => {
    assert.equal(typeof select.isOpen, 'boolean', 'select.isOpen is a boolean');
    assert.equal(typeof select.highlighted, 'string', 'select.highlighted is a string');
    assert.equal(typeof select.searchText, 'string', 'select.searchText is a string');
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
  assert.expect(10);

  this.numbers = numbers;
  this.handleFocus = (select, e) => {
    assert.equal(typeof select.isOpen, 'boolean', 'select.isOpen is a boolean');
    assert.equal(typeof select.highlighted, 'string', 'select.highlighted is a string');
    assert.equal(typeof select.searchText, 'string', 'select.searchText is a string');
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

test('the `onopen` action is invoked just before the dropdown opens', function(assert) {
  assert.expect(11);

  this.numbers = numbers;
  this.handleOpen = (select, e) => {
    assert.equal(select.isOpen, false, 'select.isOpen is still false');
    assert.equal(typeof select.highlighted, 'string', 'select.highlighted is a string');
    assert.equal(typeof select.searchText, 'string', 'select.searchText is a string');
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

test('returning false from the `onopen` action prevents the single select from opening', function(assert) {
  assert.expect(11);

  this.numbers = numbers;
  this.handleOpen = (select, e) => {
    assert.equal(select.isOpen, false, 'select.isOpen is still false');
    assert.equal(typeof select.highlighted, 'string', 'select.highlighted is a string');
    assert.equal(typeof select.searchText, 'string', 'select.searchText is a string');
    assert.equal(typeof select.actions.open, 'function', 'select.actions.open is a function');
    assert.equal(typeof select.actions.close, 'function', 'select.actions.close is a function');
    assert.equal(typeof select.actions.reposition, 'function', 'select.actions.reposition is a function');
    assert.equal(typeof select.actions.search, 'function', 'select.actions.search is a function');
    assert.equal(typeof select.actions.highlight, 'function', 'select.actions.highlight is a function');
    assert.equal(typeof select.actions.select, 'function', 'select.actions.select is a function');
    assert.ok(e instanceof window.Event, 'The second argument is an event');
    return false;
  };

  this.render(hbs`
    {{#power-select options=numbers onchange=(action (mut foo)) onopen=handleOpen as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-dropdown').length, 0, 'Dropdown didn\'t open');
});

test('returning false from the `onopen` action prevents the multiple select from opening', function(assert) {
  assert.expect(11);

  this.numbers = numbers;
  this.handleOpen = (select, e) => {
    assert.equal(select.isOpen, false, 'select.isOpen is still false');
    assert.equal(typeof select.highlighted, 'string', 'select.highlighted is a string');
    assert.equal(typeof select.searchText, 'string', 'select.searchText is a string');
    assert.equal(typeof select.actions.open, 'function', 'select.actions.open is a function');
    assert.equal(typeof select.actions.close, 'function', 'select.actions.close is a function');
    assert.equal(typeof select.actions.reposition, 'function', 'select.actions.reposition is a function');
    assert.equal(typeof select.actions.search, 'function', 'select.actions.search is a function');
    assert.equal(typeof select.actions.highlight, 'function', 'select.actions.highlight is a function');
    assert.equal(typeof select.actions.select, 'function', 'select.actions.select is a function');
    assert.ok(e instanceof window.Event, 'The second argument is an event');
    return false;
  };

  this.render(hbs`
    {{#power-select-multiple options=numbers onchange=(action (mut foo)) onopen=handleOpen as |option|}}
      {{option}}
    {{/power-select-multiple}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-dropdown').length, 0, 'Dropdown didn\'t open');
});

test('the `onclose` action is invoked just before the dropdown closes', function(assert) {
  assert.expect(12);

  this.numbers = numbers;
  this.handleClose = (select, e) => {
    assert.equal(select.isOpen, true, 'select.isOpen is still true');
    assert.equal(typeof select.highlighted, 'string', 'select.highlighted is a string');
    assert.equal(typeof select.searchText, 'string', 'select.searchText is a string');
    assert.equal(typeof select.actions.open, 'function', 'select.actions.open is a function');
    assert.equal(typeof select.actions.close, 'function', 'select.actions.close is a function');
    assert.equal(typeof select.actions.reposition, 'function', 'select.actions.reposition is a function');
    assert.equal(typeof select.actions.search, 'function', 'select.actions.search is a function');
    assert.equal(typeof select.actions.highlight, 'function', 'select.actions.highlight is a function');
    assert.equal(typeof select.actions.select, 'function', 'select.actions.select is a function');
    assert.equal(typeof select.actions.choose, 'function', 'select.actions.choose is a function');
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

test('returning false from the `onclose` action prevents the single select from closing', function(assert) {
  assert.expect(12);

  this.numbers = numbers;
  this.handleClose = (select, e) => {
    assert.equal(select.isOpen, true, 'select.isOpen is still true');
    assert.equal(typeof select.highlighted, 'string', 'select.highlighted is a string');
    assert.equal(typeof select.searchText, 'string', 'select.searchText is a string');
    assert.equal(typeof select.actions.open, 'function', 'select.actions.open is a function');
    assert.equal(typeof select.actions.close, 'function', 'select.actions.close is a function');
    assert.equal(typeof select.actions.reposition, 'function', 'select.actions.reposition is a function');
    assert.equal(typeof select.actions.search, 'function', 'select.actions.search is a function');
    assert.equal(typeof select.actions.highlight, 'function', 'select.actions.highlight is a function');
    assert.equal(typeof select.actions.select, 'function', 'select.actions.select is a function');
    assert.ok(e instanceof window.Event, 'The second argument is an event');
    return false;
  };

  this.render(hbs`
    {{#power-select options=numbers onchange=(action (mut foo)) onclose=handleClose as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-dropdown').length, 1, 'Dropdown is open');
  clickTrigger();
  assert.equal($('.ember-power-select-dropdown').length, 1, 'Dropdown didn\'t close');
});

test('returning false from the `onclose` action prevents the multiple select from closing', function(assert) {
  assert.expect(12);

  this.numbers = numbers;
  this.handleClose = (select, e) => {
    assert.equal(select.isOpen, true, 'select.isOpen is still true');
    assert.equal(typeof select.highlighted, 'string', 'select.highlighted is a string');
    assert.equal(typeof select.searchText, 'string', 'select.searchText is a string');
    assert.equal(typeof select.actions.open, 'function', 'select.actions.open is a function');
    assert.equal(typeof select.actions.close, 'function', 'select.actions.close is a function');
    assert.equal(typeof select.actions.reposition, 'function', 'select.actions.reposition is a function');
    assert.equal(typeof select.actions.search, 'function', 'select.actions.search is a function');
    assert.equal(typeof select.actions.highlight, 'function', 'select.actions.highlight is a function');
    assert.equal(typeof select.actions.select, 'function', 'select.actions.select is a function');
    assert.ok(e instanceof window.Event, 'The second argument is an event');
    return false;
  };

  this.render(hbs`
    {{#power-select-multiple options=numbers onchange=(action (mut foo)) onclose=handleClose as |option|}}
      {{option}}
    {{/power-select-multiple}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-dropdown').length, 1, 'Dropdown is open');
  clickTrigger();
  assert.equal($('.ember-power-select-dropdown').length, 1, 'Dropdown didn\'t close');
});

test('the `oninput` action is invoked when the user modifies the text of the search input on single selects, and the search happens', function(assert) {
  assert.expect(15);

  this.numbers = numbers;
  this.handleInput = (value, select, e) => {
    assert.equal(value, 'tw', 'The first argument is the value of the input');
    assert.equal(typeof select.isOpen, 'boolean', 'select.isOpen is a boolean');
    assert.equal(typeof select.highlighted, 'string', 'select.highlighted is a string');
    assert.equal(select.searchText, '', 'select.searchText is still empty');
    assert.equal(typeof select.actions.open, 'function', 'select.actions.open is a function');
    assert.equal(typeof select.actions.close, 'function', 'select.actions.close is a function');
    assert.equal(typeof select.actions.reposition, 'function', 'select.actions.reposition is a function');
    assert.equal(typeof select.actions.search, 'function', 'select.actions.search is a function');
    assert.equal(typeof select.actions.highlight, 'function', 'select.actions.highlight is a function');
    assert.equal(typeof select.actions.select, 'function', 'select.actions.select is a function');
    assert.ok(e instanceof window.Event, 'The third argument is an event');
  };

  this.render(hbs`
    {{#power-select options=numbers selected=foo oninput=handleInput onchange=(action (mut foo)) as |number|}}
      {{number}}
    {{/power-select}}
  `);

  clickTrigger();
  typeInSearch('tw');
  assert.equal($('.ember-power-select-option').length, 3, 'There is three options');
  assert.equal($('.ember-power-select-option:eq(0)').text().trim(), 'two');
  assert.equal($('.ember-power-select-option:eq(1)').text().trim(), 'twelve');
  assert.equal($('.ember-power-select-option:eq(2)').text().trim(), 'twenty');
});

test('the `oninput` action is invoked when the user modifies the text of the search input on multiple selects, and the search happens', function(assert) {
  assert.expect(15);

  this.numbers = numbers;
  this.handleInput = (value, select, e) => {
    assert.equal(value, 'tw', 'The first argument is the value of the input');
    assert.equal(typeof select.isOpen, 'boolean', 'select.isOpen is a boolean');
    assert.equal(typeof select.highlighted, 'string', 'select.highlighted is a string');
    assert.equal(select.searchText, '', 'select.searchText is still empty');
    assert.equal(typeof select.actions.open, 'function', 'select.actions.open is a function');
    assert.equal(typeof select.actions.close, 'function', 'select.actions.close is a function');
    assert.equal(typeof select.actions.reposition, 'function', 'select.actions.reposition is a function');
    assert.equal(typeof select.actions.search, 'function', 'select.actions.search is a function');
    assert.equal(typeof select.actions.highlight, 'function', 'select.actions.highlight is a function');
    assert.equal(typeof select.actions.select, 'function', 'select.actions.select is a function');
    assert.ok(e instanceof window.Event, 'The third argument is an event');
  };

  this.render(hbs`
    {{#power-select-multiple options=numbers selected=foo oninput=handleInput onchange=(action (mut foo)) as |number|}}
      {{number}}
    {{/power-select-multiple}}
  `);

  clickTrigger();
  typeInSearch('tw');
  assert.equal($('.ember-power-select-option').length, 3, 'There is three options');
  assert.equal($('.ember-power-select-option:eq(0)').text().trim(), 'two');
  assert.equal($('.ember-power-select-option:eq(1)').text().trim(), 'twelve');
  assert.equal($('.ember-power-select-option:eq(2)').text().trim(), 'twenty');
});

test('if the `oninput` action of single selects returns false the search is cancelled', function(assert) {
  assert.expect(1);

  this.numbers = numbers;
  this.handleInput = (/*value, select, e*/) => {
    return false;
  };

  this.render(hbs`
    {{#power-select options=numbers selected=foo oninput=handleInput onchange=(action (mut foo)) as |number|}}
      {{number}}
    {{/power-select}}
  `);

  clickTrigger();
  typeInSearch('tw');
  assert.equal($('.ember-power-select-option').length, 20, 'There is the same options than before');
});

test('if `oninput` action of multiple selects returns false the search is cancelled', function(assert) {
  assert.expect(1);

  this.numbers = numbers;
  this.handleInput = (/*value, select, e*/) => {
    return false;
  };

  this.render(hbs`
    {{#power-select-multiple options=numbers selected=foo oninput=handleInput onchange=(action (mut foo)) as |number|}}
      {{number}}
    {{/power-select-multiple}}
  `);

  clickTrigger();
  typeInSearch('tw');
  assert.equal($('.ember-power-select-option').length, 20, 'There is the same options than before');
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

test('The search action of multiple selects has the searchText set to the up-to-date value', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.handleSearch = (term, select) => {
    assert.equal(term, 'el', 'The search term is received as 1st argument');
    assert.equal(select.searchText, 'el', 'the public API object has the searchText up to date');
  };

  this.render(hbs`
    {{#power-select-multiple options=numbers selected=foo onchange=(action (mut foo)) search=handleSearch as |number|}}
      {{number}}
    {{/power-select-multiple}}
  `);

  clickTrigger();
  typeInSearch('el');
});