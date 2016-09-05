// import Ember from 'ember';
import {moduleForComponent, test} from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import {touchTrigger, nativeTouch} from '../../../helpers/ember-power-select';

import {numbers} from '../constants';

moduleForComponent('ember-power-select', 'Integration | Component | Ember Power Select (Touch control)', {
  integration: true
});

test('Touch on trigger should open the dropdown', function (assert) {
  assert.expect(1);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  touchTrigger();
  assert.equal($('.ember-power-select-options').length, 1, 'The dropdown is shown');
});

test('Touch on option should select it', function (assert) {
  assert.expect(1);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers selected=foo onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  touchTrigger();

  nativeTouch('.ember-power-select-option:eq(3)');

  assert.equal($('.ember-power-select-selected-item').text().trim(), 'four');
});

test('Touch on custom option should select it', function (assert) {
  assert.expect(1);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers selected=foo onchange=(action (mut foo)) as |option|}}
      <div class="super-fancy">{{option}}</div>
    {{/power-select}}
  `);

  touchTrigger();

  nativeTouch('.super-fancy:eq(3)');

  assert.equal($('.ember-power-select-selected-item').text().trim(), 'four');
});

test('Touch on clear button should deselect it', function (assert) {
  assert.expect(1);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers selected=foo allowClear=true onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  nativeTouch('.ember-power-select-clear-btn');

  assert.equal($('.ember-power-select-selected-item').text().trim(), '');
});
