import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { touchTrigger } from 'ember-power-select/test-support/helpers';
import { numbers } from '../constants';
import { find, findAll, tap } from 'ember-native-dom-helpers';

moduleForComponent('ember-power-select', 'Integration | Component | Ember Power Select (Touch control)', {
  integration: true
});

test('Touch on trigger should open the dropdown', function(assert) {
  assert.expect(1);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  touchTrigger();
  assert.ok(find('.ember-power-select-options'), 'The dropdown is shown');
});

test('Touch on option should select it', function(assert) {
  assert.expect(1);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers selected=foo onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  touchTrigger();

  tap(findAll('.ember-power-select-option')[3]);

  assert.equal(find('.ember-power-select-selected-item').textContent.trim(), 'four');
});

test('Touch on custom option should select it', function(assert) {
  assert.expect(1);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers selected=foo onchange=(action (mut foo)) as |option|}}
      <div class="super-fancy">{{option}}</div>
    {{/power-select}}
  `);

  touchTrigger();
  tap(findAll('.super-fancy')[3]);

  assert.equal(find('.ember-power-select-selected-item').textContent.trim(), 'four');
});

test('Touch on clear button should deselect it', function(assert) {
  assert.expect(1);

  this.numbers = numbers;
  this.foo = 'one';
  this.render(hbs`
    {{#power-select options=numbers selected=foo allowClear=true onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  tap('.ember-power-select-clear-btn');

  assert.notOk(find('.ember-power-select-selected-item'), '');
});
