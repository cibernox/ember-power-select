import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { clickTrigger, nativeMouseUp } from '../../../helpers/ember-power-select';
import { numbers } from '../constants';

moduleForComponent('ember-power-select', 'Integration | Component | Ember Power Select (Mouse control)', {
  integration: true
});

test('Mouseovering a list item highlights it', function(assert) {
  assert.expect(3);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-option:eq(0)').attr('aria-current'), 'true', 'The first element is highlighted');
  Ember.run(() => {
    let event = new window.Event('mouseover', { bubbles: true, cancelable: true, view: window });
    $('.ember-power-select-option:eq(3)')[0].dispatchEvent(event);
  });
  assert.equal($('.ember-power-select-option:eq(3)').attr('aria-current'), 'true', 'The 4th element is highlighted');
  assert.equal($('.ember-power-select-option:eq(3)').text().trim(), 'four');
});

test('Clicking an item selects it, closes the dropdown and focuses the trigger', function(assert) {
  assert.expect(4);

  this.numbers = numbers;
  this.foo = (val, dropdown) => {
    assert.equal(val, 'four', 'The action is invoked with the selected value as first parameter');
    assert.ok(dropdown.actions.close, 'The action is invoked with the the dropdown object as second parameter');
  };
  this.render(hbs`
    {{#power-select options=numbers onchange=foo as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  nativeMouseUp('.ember-power-select-option:eq(3)');
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The select was closed');
  assert.ok($('.ember-power-select-trigger').get(0) === document.activeElement, 'The trigger is focused');
});

test('Clicking the trigger while the select is opened closes it and and focuses the trigger', function(assert) {
  assert.expect(3);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-dropdown').length, 1, 'The select is opened');
  clickTrigger();
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The select is closed');
  assert.ok($('.ember-power-select-trigger').get(0) === document.activeElement, 'The trigger is focused');
});

test('Doing mousedown the clear button removes the selection but does not open the select', function(assert) {
  assert.expect(6);

  this.numbers = numbers;
  this.onChange = (selected, dropdown) => {
    assert.equal(selected, null, 'The onchange action was called with the new selection (null)');
    assert.ok(dropdown.actions.close, 'The onchange action was called with the dropdown object as second argument');
    this.set('selected', selected);
  };
  this.selected = "three";
  this.render(hbs`
    {{#power-select options=numbers selected=selected allowClear=true onchange=onChange as |option|}}
      {{option}}
    {{/power-select}}
  `);

  assert.equal($('.ember-power-select-dropdown').length, 0, 'The select is closed');
  assert.ok(/three/.test($('.ember-power-select-trigger').text().trim()), 'A element is selected');
  Ember.run(() => {
    let event = new window.Event('mousedown', { bubbles: true, cancelable: true, view: window });
    $('.ember-power-select-clear-btn')[0].dispatchEvent(event);
  });
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The select is still closed');
  assert.ok(!/three/.test($('.ember-power-select-trigger').text().trim()), 'That element is not selected now');
});

test('Clicking anywhere outside the select while opened closes the component and doesn\'t focuses the trigger', function(assert) {
  assert.expect(3);

  this.numbers = numbers;
  this.render(hbs`
    <div id="other-thing">Foo</div>
    {{#power-select options=numbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-dropdown').length, 1, 'The select is opened');
  Ember.run(() => {
    let event = new window.Event('mousedown');
    this.$('#other-thing')[0].dispatchEvent(event);
  });
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The select is closed');
  assert.ok($('.ember-power-select-trigger').get(0) !== document.activeElement, 'The select is not focused');
});

test('Doing mouseup over an option less than 2px in the Y axis of where the mousedown that opened the component was triggered doesn\'t select the option', function(assert) {
  assert.expect(4);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers selected=foo onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger(null, { clientY: 123 });
  assert.equal($('.ember-power-select-dropdown').length, 1, 'The select is opened');
  Ember.run(() => {
    let event = new window.Event('mouseup', { bubbles: true, cancelable: true, view: window });
    event.clientY = 124;
    Ember.run(() => Ember.$('.ember-power-select-option:eq(1)')[0].dispatchEvent(event));
  });
  assert.equal($('.ember-power-select-dropdown').length, 1, 'The select is still opened');
  Ember.run(() => {
    let event = new window.Event('mouseup', { bubbles: true, cancelable: true, view: window });
    event.clientY = 125;
    Ember.run(() => Ember.$('.ember-power-select-option:eq(1)')[0].dispatchEvent(event));
  });
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The select is closed now');
  assert.equal(this.$('.ember-power-select-trigger').text().trim(), 'two', 'The element has been selected');
});

test('Clicking on a wrapped option should select it', function(assert) {
  assert.expect(3);

  this.numbers = numbers;

  this.foo = (val) => {
    assert.equal(val, 'four', 'The expected value was selected');
  };

  this.render(hbs`
    {{#power-select options=numbers onchange=foo as |option|}}
      <span class="special-class">{{option}}</span>
    {{/power-select}}
  `);

  clickTrigger();
  nativeMouseUp('.special-class:eq(3)');
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The select was closed');
  assert.ok($('.ember-power-select-trigger').get(0) === document.activeElement, 'The trigger is focused');
});

test('Mouse-overing on a wrapped option should select it', function(assert) {
  assert.expect(2);

  this.numbers = numbers;

  this.render(hbs`
    {{#power-select options=numbers selected=foo onchange=(action (mut foo)) as |option|}}
      <span class="special-class">{{option}}</span>
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-option[aria-current="true"]').text().trim(), 'one', 'The first element is highlighted');
  Ember.run(() => {
    let event = new window.Event('mouseover', { bubbles: true, cancelable: true, view: window });
    $('.special-class:eq(3)')[0].dispatchEvent(event);
  });
  assert.equal($('.ember-power-select-option[aria-current="true"]').text().trim(), 'four', 'The fourth element is highlighted');
});

test('Mouse-overing the list itself doesn\'t crashes the app', function(assert) {
  assert.expect(0); // NOTE: The fact that this tests runs without errors is the prove that it works

  this.numbers = numbers;

  this.render(hbs`
    {{#power-select options=numbers selected=foo onchange=(action (mut foo)) as |option|}}
      <span class="special-class">{{option}}</span>
    {{/power-select}}
  `);

  clickTrigger();
  Ember.run(() => {
    let event = new window.Event('mouseover', { bubbles: true, cancelable: true, view: window });
    $('ul')[0].dispatchEvent(event);
  });
});

