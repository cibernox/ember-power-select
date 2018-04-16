import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { selectChoose } from 'ember-power-select/test-support/helpers';
import { numbers } from '../constants';

module('Integration | Helpers | selectChoose', function(hooks) {
  setupRenderingTest(hooks);

  test('selectChoose selects the given value on single selects', async function(assert) {
    assert.expect(2);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select options=numbers selected=foo onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select}}
    `);

    assert.dom('.ember-power-select-trigger').hasText('', 'The select is empty');
    await selectChoose('.ember-power-select-trigger', 'three');
    assert.dom('.ember-power-select-trigger').hasText('three', 'The values has been selected');
  });

  test('selectChoose selects the given value on multiple selects', async function(assert) {
    assert.expect(3);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select-multiple options=numbers selected=foo onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);

    assert.dom('.ember-power-select-multiple-option').doesNotExist('There is no selected options');
    await selectChoose('.ember-power-select-trigger', 'three');
    assert.dom('.ember-power-select-multiple-option ').exists({ count: 1 }, 'There is one selected option');
    await selectChoose('.ember-power-select-trigger', 'five');
    assert.dom('.ember-power-select-multiple-option ').exists({ count: 2 }, 'There is one selected option');
  });
});
