import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { triggerKeydown, clickTrigger } from '../../../helpers/ember-power-select';
import { numbers } from '../constants';

moduleForComponent('ember-power-select', 'Integration | Component | Ember Power Select (Keyboard control)', {
  integration: true
});

test('Pressing keydown highlights the next option', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-option--highlighted').text().trim(), 'one');
  triggerKeydown($('.ember-power-select-search input')[0], 40);
  assert.equal($('.ember-power-select-option--highlighted').text().trim(), 'two', 'The next options is highlighted now');
});

test('Pressing keyup highlights the previous option', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers selected="three" onchange=(action (mut selected)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-option--highlighted').text().trim(), 'three');
  triggerKeydown($('.ember-power-select-search input')[0], 38);
  assert.equal($('.ember-power-select-option--highlighted').text().trim(), 'two', 'The previous options is highlighted now');
});

test('When you the last option is highlighted, pressing keydown doesn\'t change the highlighted', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.lastNumber = numbers[numbers.length - 1];
  this.render(hbs`
    {{#power-select options=numbers selected=lastNumber onchange=(action (mut lastNumber)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-option--highlighted').text().trim(), 'twenty');
  triggerKeydown($('.ember-power-select-search input')[0], 40);
  assert.equal($('.ember-power-select-option--highlighted').text().trim(), 'twenty', 'The last option is still the highlighted one');
});

test('When you the first option is highlighted, pressing keyup doesn\'t change the highlighted', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.firstNumber = numbers[0];
  this.render(hbs`
    {{#power-select options=numbers selected=firstNumber onchange=(action (mut firstNumber)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-option--highlighted').text().trim(), 'one');
  triggerKeydown($('.ember-power-select-search input')[0], 38);
  assert.equal($('.ember-power-select-option--highlighted').text().trim(), 'one', 'The first option is still the highlighted one');
});

test('Pressing ENTER selects the highlighted element, closes the dropdown and focuses the trigger', function(assert) {
  assert.expect(5);

  this.numbers = numbers;
  this.changed = (val, dropdown) => {
    assert.equal(val, 'two', 'The onchange action is triggered with the selected value');
    this.set('selected', val);
    assert.ok(dropdown.actions.close, 'The action receives the dropdown as second argument');
  };

  this.render(hbs`
    {{#power-select options=numbers selected=selected onchange=(action changed) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  triggerKeydown($('.ember-power-select-search input')[0], 40);
  triggerKeydown($('.ember-power-select-search input')[0], 13);
  assert.equal($('.ember-power-select-trigger').text().trim(), 'two', 'The highlighted element was selected');
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The dropdown is closed');
  assert.ok($('.ember-power-select-trigger').get(0) === document.activeElement, 'The trigger is focused');
});

test('Pressing TAB closes the select WITHOUT selecting the highlighed element and focuses the trigger', function(assert) {
  assert.expect(3);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  triggerKeydown($('.ember-power-select-search input')[0], 40);
  triggerKeydown($('.ember-power-select-search input')[0], 9);
  assert.equal($('.ember-power-select-trigger').text().trim(), '', 'The highlighted element wasn\'t selected');
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The dropdown is closed');
  assert.ok($('.ember-power-select-trigger').get(0) === document.activeElement, 'The trigges is focused');
});

test('The component is focusable using the TAB key as any other kind of input', function(assert) {
  assert.expect(1);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);
  assert.equal(this.$('.ember-power-select-trigger').attr('tabindex'), "0", 'The trigger is reachable with TAB');
});

test('If the component is focused, pressing ENTER opens it', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  Ember.run(() => $('.ember-power-select-trigger').focus());
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The select is closed');
  triggerKeydown($('.ember-power-select-trigger')[0], 13);
  assert.equal($('.ember-power-select-dropdown').length, 1, 'The select is opened');
});

test('If the single component is focused, pressing KEYDOWN opens it', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  Ember.run(() => $('.ember-power-select-trigger').focus());
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The select is closed');
  triggerKeydown($('.ember-power-select-trigger')[0], 40);
  assert.equal($('.ember-power-select-dropdown').length, 1, 'The select is opened');
});

test('If the single component is focused, pressing KEYUP opens it', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  Ember.run(() => $('.ember-power-select-trigger').focus());
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The select is closed');
  triggerKeydown($('.ember-power-select-trigger')[0], 38);
  assert.equal($('.ember-power-select-dropdown').length, 1, 'The select is opened');
});

test('Pressing ESC while the component is opened closes it and focuses the trigger', function(assert) {
  assert.expect(3);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-dropdown').length, 1, 'The select is opened');
  triggerKeydown($('.ember-power-select-trigger')[0], 27);
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The select is closed');
  assert.ok($('.ember-power-select-trigger').get(0) === document.activeElement, 'The select is focused');
});

test('In single-mode, when the user presses a key being the search input focused the passes `onkeydown` action is invoked with the public API and the event', function(assert) {
  assert.expect(9);

  this.numbers = numbers;
  this.selected = null;
  this.handleKeydown = (select, e) => {
    assert.ok(select.hasOwnProperty('isOpen'), 'The yieded object has the `isOpen` key');
    assert.ok(select.actions.open, 'The yieded object has an `actions.open` key');
    assert.ok(select.actions.close, 'The yieded object has an `actions.close` key');
    assert.ok(select.actions.select, 'The yieded object has an `actions.select` key');
    assert.ok(select.actions.highlight, 'The yieded object has an `actions.highlight` key');
    assert.ok(select.actions.search, 'The yieded object has an `actions.search` key');
    assert.equal(e.keyCode, 13, 'The event is received as second argument');
  };

  this.render(hbs`
    {{#power-select options=numbers selected=selected onchange=(action (mut foo)) onkeydown=(action handleKeydown) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-dropdown').length, 1, 'The select is opened');
  triggerKeydown($('.ember-power-select-search input')[0], 13);
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The select is closed');
});

test('in single-mode if the users calls preventDefault on the event received in the `onkeydown` action it prevents the component to do the usual thing', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.selected = null;
  this.handleKeydown = (select, e) => {
    e.preventDefault();
  };

  this.render(hbs`
    {{#power-select options=numbers selected=selected onchange=(action (mut foo)) onkeydown=(action handleKeydown) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-dropdown').length, 1, 'The select is opened');
  triggerKeydown($('.ember-power-select-search input')[0], 13);
  assert.equal($('.ember-power-select-dropdown').length, 1, 'The select is still opened');
});

test('In multiple-mode, when the user presses a key being the search input focused the passes `onkeydown` action is invoked with the public API and the event', function(assert) {
  assert.expect(9);

  this.numbers = numbers;
  this.selectedNumbers = [];
  this.handleKeydown = (select, e) => {
    assert.ok(select.hasOwnProperty('isOpen'), 'The yieded object has the `isOpen` key');
    assert.ok(select.actions.open, 'The yieded object has an `actions.open` key');
    assert.ok(select.actions.close, 'The yieded object has an `actions.close` key');
    assert.ok(select.actions.select, 'The yieded object has an `actions.select` key');
    assert.ok(select.actions.highlight, 'The yieded object has an `actions.highlight` key');
    assert.ok(select.actions.search, 'The yieded object has an `actions.search` key');
    assert.equal(e.keyCode, 13, 'The event is received as second argument');
  };

  this.render(hbs`
    {{#power-select multiple=true options=numbers selected=selectedNumbers onchange=(action (mut foo)) onkeydown=(action handleKeydown) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-dropdown').length, 1, 'The select is opened');
  triggerKeydown($('.ember-power-select-trigger-multiple-input')[0], 13);
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The select is closed');
});

test('in multiple-mode if the users calls preventDefault on the event received in the `onkeydown` action it prevents the component to do the usual thing', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.selectedNumbers = [];
  this.handleKeydown = (select, e) => {
    e.preventDefault();
  };

  this.render(hbs`
    {{#power-select multiple=true options=numbers selected=selectedNumbers onchange=(action (mut foo)) onkeydown=(action handleKeydown) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-dropdown').length, 1, 'The select is opened');
  triggerKeydown($('.ember-power-select-trigger-multiple-input')[0], 13);
  assert.equal($('.ember-power-select-dropdown').length, 1, 'The select is still opened');
});
