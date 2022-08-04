import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import {
  selectChoose,
  getDropdownItems,
} from 'ember-power-select/test-support/helpers';
import { numbers } from '../constants';

module('Integration | Helpers | selectChoose', function (hooks) {
  setupRenderingTest(hooks);

  test('selectChoose selects the given value on single selects', async function (assert) {
    assert.expect(2);

    this.numbers = numbers;
    await render(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.foo}} @onChange={{action (mut this.foo)}} as |option|>
        {{option}}
      </PowerSelect>
    `);

    assert
      .dom('.ember-power-select-trigger')
      .hasText('', 'The select is empty');
    await selectChoose('.ember-power-select-trigger', 'three');
    assert
      .dom('.ember-power-select-trigger')
      .hasText('three', 'The values has been selected');
  });

  test('selectChoose selects the given value on multiple selects', async function (assert) {
    assert.expect(3);

    this.numbers = numbers;
    await render(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.foo}} @onChange={{action (mut this.foo)}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

    assert
      .dom('.ember-power-select-multiple-option')
      .doesNotExist('There is no selected options');
    await selectChoose('.ember-power-select-trigger', 'three');
    assert
      .dom('.ember-power-select-multiple-option ')
      .exists({ count: 1 }, 'There is one selected option');
    await selectChoose('.ember-power-select-trigger', 'five');
    assert
      .dom('.ember-power-select-multiple-option ')
      .exists({ count: 2 }, 'There is one selected option');
  });
});

module('Integration | Helpers | getDropdownItems', function (hooks) {
  setupRenderingTest(hooks);

  test('getDropdownItems should give the list of items in the select dropdown', async function (assert) {
    assert.expect(1);

    this.numbers = numbers;
    await render(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.foo}} @onChange={{action (mut this.foo)}} as |option|>
        {{option}}
      </PowerSelect>
    `);

    let options = await getDropdownItems('.ember-power-select-trigger');
    assert.deepEqual(
      options,
      numbers,
      'elements from the dropdown should be same as passed elements'
    );
  });

  test('getDropdownItems should throws an error when selector is not matched', async function (assert) {
    assert.expect(1);

    this.numbers = numbers;
    await render(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.foo}} @onChange={{action (mut this.foo)}} as |option|>
        {{option}}
      </PowerSelect>
    `);

    try {
      await getDropdownItems('.fake-ember-power-select-trigger');
    } catch (error) {
      assert.strictEqual(
        error.message,
        'You called "getDropdownItems(\'.fake-ember-power-select-trigger\'" but no select was found using selector ".fake-ember-power-select-trigger"',
        'elements from the dropdown should be same as passed elements'
      );
    }
  });
});
