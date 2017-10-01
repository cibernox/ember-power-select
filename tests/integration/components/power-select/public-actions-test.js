import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { clickTrigger, typeInSearch } from '../../../helpers/ember-power-select';
import { numbers } from '../constants';
import { find, findAll, click, keyEvent, focus } from 'ember-native-dom-helpers';
import { run } from '@ember/runloop';

function assertPublicAPIShape(assert, select) {
  assert.equal(typeof select.uniqueId, 'string', 'select.uniqueId is a string');
  assert.equal(typeof select.isOpen, 'boolean', 'select.isOpen is a boolean');
  assert.equal(typeof select.disabled, 'boolean', 'select.disabled is a boolean');
  assert.equal(typeof select.isActive, 'boolean', 'select.isActive is a boolean');
  assert.equal(typeof select.loading, 'boolean', 'select.loading is a boolean');
  assert.ok(select.options instanceof Array, 'select.options is an array');
  assert.ok(select.results instanceof Array, 'select.results is an array');
  assert.equal(typeof select.resultsCount, 'number', 'select.resultsCount is a number');
  assert.ok(select.hasOwnProperty('selected'));
  assert.ok(select.hasOwnProperty('highlighted'));
  assert.equal(typeof select.searchText, 'string', 'select.searchText is a string');
  assert.equal(typeof select.lastSearchedText, 'string', 'select.lastSearchedText is a string');
  assert.equal(typeof select.actions.open, 'function', 'select.actions.open is a function');
  assert.equal(typeof select.actions.close, 'function', 'select.actions.close is a function');
  assert.equal(typeof select.actions.toggle, 'function', 'select.actions.toggle is a function');
  assert.equal(typeof select.actions.reposition, 'function', 'select.actions.reposition is a function');
  assert.equal(typeof select.actions.search, 'function', 'select.actions.search is a function');
  assert.equal(typeof select.actions.highlight, 'function', 'select.actions.highlight is a function');
  assert.equal(typeof select.actions.select, 'function', 'select.actions.select is a function');
  assert.equal(typeof select.actions.choose, 'function', 'select.actions.choose is a function');
  assert.equal(typeof select.actions.scrollTo, 'function', 'select.actions.scrollTo is a function');
}

moduleForComponent('ember-power-select', 'Integration | Component | Ember Power Select (Public actions)', {
  integration: true
});

test('The search action of single selects action receives the search term and the public API', function(assert) {
  assert.expect(22);

  this.numbers = numbers;
  this.handleSearch = (term, select) => {
    assert.equal(term, 'el', 'The search term is received as 1st argument');
    assertPublicAPIShape(assert, select);
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
  assert.expect(22);

  this.numbers = numbers;
  this.handleSearch = (term, select) => {
    assert.equal(term, 'el', 'The search term is received as 1st argument');
    assertPublicAPIShape(assert, select);
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
  assert.expect(22);

  this.numbers = numbers;
  this.handleChange = (selected, select) => {
    assert.equal(selected, 'one', 'The first option is the selected');
    assertPublicAPIShape(assert, select);
  };

  this.render(hbs`
    {{#power-select options=numbers selected=foo onchange=handleChange as |number|}}
      {{number}}
    {{/power-select}}
  `);

  clickTrigger();
  click('.ember-power-select-option');
});

test('The onchange of multiple selects action receives the selection and the public API', function(assert) {
  assert.expect(22);

  this.numbers = numbers;
  this.handleChange = (selected, select) => {
    assert.equal(selected, 'one', 'The first option is the selected');
    assertPublicAPIShape(assert, select);
  };

  this.render(hbs`
    {{#power-select-multiple options=numbers selected=foo onchange=handleChange as |number|}}
      {{number}}
    {{/power-select-multiple}}
  `);

  clickTrigger();
  click('.ember-power-select-option');
});

test('The onkeydown of single selects action receives the public API and the keydown event when fired on the searchbox', function(assert) {
  assert.expect(44);

  this.numbers = numbers;
  this.onKeyDown = (select, e) => {
    assertPublicAPIShape(assert, select);
    assert.ok(e instanceof window.Event, 'The second argument is an event');
  };

  this.render(hbs`
    {{#power-select options=numbers selected=foo onkeydown=onKeyDown onchange=(action (mut foo)) as |number|}}
      {{number}}
    {{/power-select}}
  `);

  clickTrigger();
  let input = find('.ember-power-select-search-input');
  keyEvent(input, 'keydown', 13);
  keyEvent(input, 'keydown', 65);
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
  let trigger = find('.ember-power-select-trigger');
  keyEvent(trigger, 'keydown', 40);
  keyEvent(trigger, 'keydown', 40);
  keyEvent(trigger, 'keydown', 9);
  assert.equal(trigger.textContent.trim(), 'three', 'The highlighted options has been selected');
  assert.notOk(find('.ember-power-select-dropdown'), 'Dropdown is opened');
});

test('The onkeydown of multiple selects action receives the public API and the keydown event', function(assert) {
  assert.expect(44);

  this.numbers = numbers;
  this.onKeyDown = (select, e) => {
    assertPublicAPIShape(assert, select);
    assert.ok(e instanceof window.Event, 'The second argument is an event');
  };

  this.render(hbs`
    {{#power-select-multiple options=numbers selected=foo onkeydown=onKeyDown onchange=(action (mut foo)) as |number|}}
      {{number}}
    {{/power-select-multiple}}
  `);

  clickTrigger();
  let input = find('.ember-power-select-trigger-multiple-input');
  keyEvent(input, 'keydown', 13);
  keyEvent(input, 'keydown', 65);
});

test('returning false from the `onkeydown` action prevents the default behaviour in single selects', function(assert) {
  assert.expect(48);

  this.numbers = numbers;
  this.handleKeyDown = (select, e) => {
    assert.equal(select.isOpen, false, 'select.isOpen is still false');
    assertPublicAPIShape(assert, select);
    assert.ok(e instanceof window.Event, 'The second argument is an event');
    return false;
  };

  this.render(hbs`
    {{#power-select options=numbers selected=foo onchange=(action (mut foo)) onkeydown=handleKeyDown as |option|}}
      {{option}}
    {{/power-select}}
  `);

  keyEvent('.ember-power-select-trigger', 'keydown', 13);
  assert.notOk(find('.ember-power-select-dropdown'), 'Dropdown is still closed');
  keyEvent('.ember-power-select-trigger', 'keydown', 84); // 't'
  assert.notEqual(find('.ember-power-select-trigger').textContent.trim(), 'two', 'nothing was selected');
});

test('returning false from the `onkeydown` action prevents the default behaviour in multiple selects', function(assert) {
  assert.expect(24);

  this.numbers = numbers;
  this.handleKeyDown = (select, e) => {
    assert.equal(select.isOpen, false, 'select.isOpen is still false');
    assertPublicAPIShape(assert, select);
    assert.ok(e instanceof window.Event, 'The second argument is an event');
    return false;
  };

  this.render(hbs`
    {{#power-select-multiple options=numbers selected=foo onchange=(action (mut foo)) onkeydown=handleKeyDown as |option|}}
      {{option}}
    {{/power-select-multiple}}
  `);

  keyEvent('.ember-power-select-trigger-multiple-input', 'keydown', 13);
  assert.notOk(find('.ember-power-select-dropdown'), 'Dropdown is still closed');
});

test('The onfocus of single selects action receives the public API and the focus event', function(assert) {
  assert.expect(22);

  this.numbers = numbers;
  this.handleFocus = (select, e) => {
    assertPublicAPIShape(assert, select);
    assert.ok(e instanceof window.Event, 'The second argument is an event');
  };

  this.render(hbs`
    {{#power-select options=numbers selected=foo onfocus=handleFocus onchange=(action (mut foo)) as |number|}}
      {{number}}
    {{/power-select}}
  `);

  run(() => find('.ember-power-select-trigger').focus());
});

test('The onfocus of multiple selects action receives the public API and the focus event', function(assert) {
  assert.expect(44);

  this.numbers = numbers;
  this.handleFocus = (select, e) => {
    assertPublicAPIShape(assert, select);
    assert.ok(e instanceof window.Event, 'The second argument is an event');
  };

  this.render(hbs`
    {{#power-select-multiple options=numbers selected=foo onfocus=handleFocus onchange=(action (mut foo)) as |number|}}
      {{number}}
    {{/power-select-multiple}}
  `);

  run(() => find('.ember-power-select-trigger').focus());
});

test('The onfocus of multiple selects also gets called when the thing getting the focus is the searbox', function(assert) {
  assert.expect(22);

  this.numbers = numbers;
  this.handleFocus = (select, e) => {
    assertPublicAPIShape(assert, select);
    assert.ok(e instanceof window.Event, 'The second argument is an event');
  };

  this.render(hbs`
    {{#power-select-multiple options=numbers selected=foo onfocus=handleFocus onchange=(action (mut foo)) as |number|}}
      {{number}}
    {{/power-select-multiple}}
  `);

  run(() => find('.ember-power-select-trigger-multiple-input').focus());
});

test('The onblur of single selects action receives the public API and the event', function(assert) {
  assert.expect(22);

  this.numbers = numbers;
  this.handleBlur = (select, e) => {
    assertPublicAPIShape(assert, select);
    assert.ok(e instanceof window.Event, 'The second argument is an event');
  };

  this.render(hbs`
    {{#power-select options=numbers selected=foo onblur=handleBlur onchange=(action (mut foo)) as |number|}}
      {{number}}
    {{/power-select}}
    <input type="text" id="other-element"/>
  `);

  run(() => find('.ember-power-select-trigger').focus());
  run(() => find('#other-element').focus());
});

test('The onblur of multiple selects action receives the public API and the focus event', function(assert) {
  assert.expect(22);

  this.numbers = numbers;
  this.handleBlur = (select, e) => {
    assertPublicAPIShape(assert, select);
    assert.ok(e instanceof window.Event, 'The second argument is an event');
  };

  this.render(hbs`
    {{#power-select-multiple options=numbers selected=foo onblur=handleBlur onchange=(action (mut foo)) as |number|}}
      {{number}}
    {{/power-select-multiple}}
    <input type="text" id="other-element"/>
  `);

  run(() => find('.ember-power-select-trigger-multiple-input').focus());
  run(() => find('#other-element').focus());
});

test('The onblur of multiple selects also gets called when the thing getting the focus is the searbox', function(assert) {
  this.numbers = numbers;
  this.handleBlur = (select, e) => {
    assertPublicAPIShape(assert, select);
    assert.ok(e instanceof window.Event, 'The second argument is an event');
  };

  this.render(hbs`
    {{#power-select options=numbers selected=foo onblur=handleBlur onchange=(action (mut foo)) as |number|}}
      {{number}}
    {{/power-select}}
    <input type="text" id="other-element"/>
  `);

  clickTrigger();
  focus('#other-element');
});

test('the `onopen` action is invoked just before the dropdown opens', function(assert) {
  assert.expect(24);

  this.numbers = numbers;
  this.handleOpen = (select, e) => {
    assert.equal(select.isOpen, false, 'select.isOpen is still false');
    assertPublicAPIShape(assert, select);
    assert.ok(e instanceof window.Event, 'The second argument is an event');
  };

  this.render(hbs`
    {{#power-select options=numbers onchange=(action (mut foo)) onopen=handleOpen as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.ok(find('.ember-power-select-dropdown'), 'Dropdown is opened');
});

test('returning false from the `onopen` action prevents the single select from opening', function(assert) {
  assert.expect(24);

  this.numbers = numbers;
  this.handleOpen = (select, e) => {
    assert.equal(select.isOpen, false, 'select.isOpen is still false');
    assertPublicAPIShape(assert, select);
    assert.ok(e instanceof window.Event, 'The second argument is an event');
    return false;
  };

  this.render(hbs`
    {{#power-select options=numbers onchange=(action (mut foo)) onopen=handleOpen as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.notOk(find('.ember-power-select-dropdown'), 'Dropdown didn\'t open');
});

test('returning false from the `onopen` action prevents the multiple select from opening', function(assert) {
  assert.expect(24);

  this.numbers = numbers;
  this.handleOpen = (select, e) => {
    assert.equal(select.isOpen, false, 'select.isOpen is still false');
    assertPublicAPIShape(assert, select);
    assert.ok(e instanceof window.Event, 'The second argument is an event');
    return false;
  };

  this.render(hbs`
    {{#power-select-multiple options=numbers onchange=(action (mut foo)) onopen=handleOpen as |option|}}
      {{option}}
    {{/power-select-multiple}}
  `);

  clickTrigger();
  assert.notOk(find('.ember-power-select-dropdown'), 'Dropdown didn\'t open');
});

test('the `onclose` action is invoked just before the dropdown closes', function(assert) {
  assert.expect(24);

  this.numbers = numbers;
  this.handleClose = (select, e) => {
    assert.equal(select.isOpen, true, 'select.isOpen is still true');
    assertPublicAPIShape(assert, select);
    assert.ok(e instanceof window.Event, 'The second argument is an event');
  };

  this.render(hbs`
    {{#power-select options=numbers onchange=(action (mut foo)) onclose=handleClose as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  clickTrigger();
  assert.notOk(find('.ember-power-select-dropdown'), 'Dropdown is closed');
});

test('returning false from the `onclose` action prevents the single select from closing', function(assert) {
  assert.expect(25);

  this.numbers = numbers;
  this.handleClose = (select, e) => {
    assert.equal(select.isOpen, true, 'select.isOpen is still true');
    assertPublicAPIShape(assert, select);
    assert.ok(e instanceof window.Event, 'The second argument is an event');
    return false;
  };

  this.render(hbs`
    {{#power-select options=numbers onchange=(action (mut foo)) onclose=handleClose as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.ok(find('.ember-power-select-dropdown'), 'Dropdown is open');
  clickTrigger();
  assert.ok(find('.ember-power-select-dropdown'), 'Dropdown didn\'t close');
});

test('returning false from the `onclose` action prevents the multiple select from closing', function(assert) {
  assert.expect(25);

  this.numbers = numbers;
  this.handleClose = (select, e) => {
    assert.equal(select.isOpen, true, 'select.isOpen is still true');
    assertPublicAPIShape(assert, select);
    assert.ok(e instanceof window.Event, 'The second argument is an event');
    return false;
  };

  this.render(hbs`
    {{#power-select-multiple options=numbers onchange=(action (mut foo)) onclose=handleClose as |option|}}
      {{option}}
    {{/power-select-multiple}}
  `);

  clickTrigger();
  assert.ok(find('.ember-power-select-dropdown'), 'Dropdown is open');
  clickTrigger();
  assert.ok(find('.ember-power-select-dropdown'), 'Dropdown didn\'t close');
});

test('the `oninput` action is invoked when the user modifies the text of the search input on single selects, and the search happens', function(assert) {
  assert.expect(28);

  this.numbers = numbers;
  this.handleInput = (value, select, e) => {
    assert.equal(value, 'tw', 'The first argument is the value of the input');
    assert.equal(select.searchText, '', 'select.searchText is still empty');
    assertPublicAPIShape(assert, select);
    assert.ok(e instanceof window.Event, 'The third argument is an event');
  };

  this.render(hbs`
    {{#power-select options=numbers selected=foo oninput=handleInput onchange=(action (mut foo)) as |number|}}
      {{number}}
    {{/power-select}}
  `);

  clickTrigger();
  typeInSearch('tw');
  let options = findAll('.ember-power-select-option');
  assert.equal(options.length, 3, 'There is three options');
  assert.equal(options[0].textContent.trim(), 'two');
  assert.equal(options[1].textContent.trim(), 'twelve');
  assert.equal(options[2].textContent.trim(), 'twenty');
});

test('the `oninput` action is invoked when the user modifies the text of the search input on multiple selects, and the search happens', function(assert) {
  assert.expect(28);

  this.numbers = numbers;
  this.handleInput = (value, select, e) => {
    assert.equal(value, 'tw', 'The first argument is the value of the input');
    assert.equal(select.searchText, '', 'select.searchText is still empty');
    assertPublicAPIShape(assert, select);
    assert.ok(e instanceof window.Event, 'The third argument is an event');
  };

  this.render(hbs`
    {{#power-select-multiple options=numbers selected=foo oninput=handleInput onchange=(action (mut foo)) as |number|}}
      {{number}}
    {{/power-select-multiple}}
  `);

  clickTrigger();
  typeInSearch('tw');
  let options = findAll('.ember-power-select-option');
  assert.equal(options.length, 3, 'There is three options');
  assert.equal(options[0].textContent.trim(), 'two');
  assert.equal(options[1].textContent.trim(), 'twelve');
  assert.equal(options[2].textContent.trim(), 'twenty');
});

test('if the `oninput` action of single selects returns false the search is cancelled', function(assert) {
  assert.expect(1);

  this.numbers = numbers;
  this.handleInput = (/* value, select, e */) => {
    return false;
  };

  this.render(hbs`
    {{#power-select options=numbers selected=foo oninput=handleInput onchange=(action (mut foo)) as |number|}}
      {{number}}
    {{/power-select}}
  `);

  clickTrigger();
  typeInSearch('tw');
  assert.equal(findAll('.ember-power-select-option').length, 20, 'There is the same options than before');
});

test('if `oninput` action of multiple selects returns false the search is cancelled', function(assert) {
  assert.expect(1);

  this.numbers = numbers;
  this.handleInput = (/* value, select, e */) => {
    return false;
  };

  this.render(hbs`
    {{#power-select-multiple options=numbers selected=foo oninput=handleInput onchange=(action (mut foo)) as |number|}}
      {{number}}
    {{/power-select-multiple}}
  `);

  clickTrigger();
  typeInSearch('tw');
  assert.equal(findAll('.ember-power-select-option').length, 20, 'There is the same options than before');
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
  assert.equal(findAll('.ember-power-select-option').length, 3, 'There is three options');
  assert.equal(find('.ember-power-select-option[aria-current="true"]').textContent.trim(), 'baz', 'The third option is highlighted');
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
  assert.equal(find('.ember-power-select-search-input').value, 'hello', 'The search text contains the searched string');
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
  assert.equal(find('.ember-power-select-trigger-multiple-input').value, 'hello', 'The search text contains the searched string');
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

test('The single component invokes the `registerAPI` action with the public API object', function(assert) {
  this.numbers = numbers;
  this.storeAPI = function(select) {
    if (select) {
      assertPublicAPIShape(assert, select);
    }
  };
  this.render(hbs`
    {{#power-select options=numbers selected=foo onchange=(action (mut foo)) registerAPI=storeAPI as |number|}}
      {{number}}
    {{/power-select}}
  `);
});

test('The multiple component invokes the `registerAPI` action with the public API object', function(assert) {
  this.numbers = numbers;
  this.storeAPI = function(select) {
    if (select) {
      assertPublicAPIShape(assert, select);
    }
  };
  this.render(hbs`
    {{#power-select-multiple options=numbers selected=foo onchange=(action (mut foo)) registerAPI=storeAPI as |number|}}
      {{number}}
    {{/power-select-multiple}}
  `);
});

test('The given `scrollTo` function is invoken when a single select wants to scroll to an element', function(assert) {
  assert.expect(22);
  this.numbers = numbers;
  this.storeAPI = (select) => {
    this.selectAPI = select;
  };
  this.scrollTo = (opt, select) => {
    assert.equal(opt, 'three', 'It receives the element we want to scroll to as first argument');
    assertPublicAPIShape(assert, select);
  };
  this.render(hbs`
    {{#power-select options=numbers selected=foo onchange=(action (mut foo)) registerAPI=storeAPI scrollTo=scrollTo as |number|}}
      {{number}}
    {{/power-select}}
  `);

  run(() => this.selectAPI.actions.scrollTo('three'));
});

test('The given `scrollTo` function is invoken when a multiple select wants to scroll to an element', function(assert) {
  assert.expect(22);
  this.numbers = numbers;
  this.storeAPI = (select) => {
    this.selectAPI = select;
  };
  this.scrollTo = (opt, select) => {
    assert.equal(opt, 'three', 'It receives the element we want to scroll to as first argument');
    assertPublicAPIShape(assert, select);
  };
  this.render(hbs`
    {{#power-select-multiple options=numbers selected=foo onchange=(action (mut foo)) registerAPI=storeAPI scrollTo=scrollTo as |number|}}
      {{number}}
    {{/power-select-multiple}}
  `);

  run(() => this.selectAPI.actions.scrollTo('three'));
});

