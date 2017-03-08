import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { numbers } from './components/constants';
import { clickTrigger, typeInSearch } from '../helpers/ember-power-select';
import { findAll } from 'ember-native-dom-helpers/test-support/helpers';

function findContains(selector, text) {
  return [].slice.apply(findAll(selector)).filter((e) => e.textContent.trim().indexOf(text) > -1)[0];
}

moduleForComponent('ember-power-select', 'Integration | Helpers', {
  integration: true
});

test('typeInSearch inputs the provided search string', function(assert) {
  this.numbers = numbers;

  this.render(hbs`
    {{#power-select options=numbers onchange=(action (mut foo)) as |number|}}
      {{number}}
    {{/power-select}}
  `);

  clickTrigger();
  typeInSearch('one');

  assert.ok(findContains('.ember-power-select-option', 'one'));
});

test('typeInSearch scopes the input to the provided one if the passed arguments are two', function(assert) {
  this.numbers = numbers;

  this.render(hbs`
    {{#power-select-multiple options=numbers onchange=(action (mut fooMultiple)) as |number|}}
      {{number}}
    {{/power-select-multiple}}
    <div id="single-select">
      {{#power-select options=numbers renderInPlace=true onchange=(action (mut foo)) as |number|}}
        {{number}}
      {{/power-select}}
    </div>
  `);

  clickTrigger('#single-select');
  typeInSearch('#single-select', 'one');

  assert.ok(findContains('#single-select .ember-power-select-option', 'one'));
});
