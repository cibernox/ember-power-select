import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { numbers } from '../constants';

moduleForComponent('ember-power-select', 'Integration | Component | Ember Power Select (Assertions & deprecations)', {
  integration: true
});

test('the `onchange` function is mandatory', function(assert) {
  assert.expect(1);

  this.numbers = numbers;

  assert.throws(() => {
    this.render(hbs`
      {{#power-select options=countries selected=selected as |opt|}}{{opt}}{{/power-select}}
    `);
  }, /requires an `onchange` function/);
});