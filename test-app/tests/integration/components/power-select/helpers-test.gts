import { module, test } from 'qunit';
import { setupRenderingTest } from 'test-app/tests/helpers';
import { render } from '@ember/test-helpers';
import { selectChoose, getDropdownItems } from 'ember-power-select/test-support';
import { numbers } from 'test-app/utils/constants';
import type { Selected } from 'ember-power-select/types';
import type { TestContext } from '@ember/test-helpers';
import PowerSelect from "ember-power-select/components/power-select";
import { fn } from "@ember/helper";
import PowerSelectMultiple from "ember-power-select/components/power-select-multiple";

interface NumbersContext<
  IsMultiple extends boolean = false,
> extends TestContext {
  numbers: typeof numbers;
  selected: Selected<string, IsMultiple>;
}

module('Integration | Helpers | selectChoose', function (hooks) {
  setupRenderingTest(hooks);

  test<NumbersContext>('selectChoose selects the given value on single selects', async function (assert) {const self = this;

    assert.expect(2);

    this.numbers = numbers;

    await render<NumbersContext>(<template>
      <PowerSelect @options={{self.numbers}} @selected={{self.selected}} @onChange={{fn (mut self.selected)}} as |option|>
        {{option}}
      </PowerSelect>
    </template>);

    assert
      .dom('.ember-power-select-trigger')
      .hasText('', 'The select is empty');
    await selectChoose('.ember-power-select-trigger', 'three');
    assert
      .dom('.ember-power-select-trigger')
      .hasText('three', 'The values has been selected');
  });

  test<
    NumbersContext<true>
  >('selectChoose selects the given value on multiple selects', async function (assert) {const self = this;

    assert.expect(3);

    this.numbers = numbers;
    await render<NumbersContext<true>>(<template>
      <PowerSelectMultiple @options={{self.numbers}} @selected={{self.selected}} @onChange={{fn (mut self.selected)}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    </template>);

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

  test<NumbersContext>('getDropdownItems should give the list of items in the select dropdown', async function (assert) {const self = this;

    assert.expect(1);

    this.numbers = numbers;
    await render<NumbersContext>(<template>
      <PowerSelect @options={{self.numbers}} @selected={{self.selected}} @onChange={{fn (mut self.selected)}} as |option|>
        {{option}}
      </PowerSelect>
    </template>);

    const options = await getDropdownItems('.ember-power-select-trigger');
    assert.deepEqual(
      options,
      numbers,
      'elements from the dropdown should be same as passed elements',
    );
  });

  test<NumbersContext>('getDropdownItems should throws an error when selector is not matched', async function (assert) {const self = this;

    assert.expect(1);

    this.numbers = numbers;
    await render<NumbersContext>(<template>
      <PowerSelect @options={{self.numbers}} @selected={{self.selected}} @onChange={{fn (mut self.selected)}} as |option|>
        {{option}}
      </PowerSelect>
    </template>);

    try {
      await getDropdownItems('.fake-ember-power-select-trigger');
    } catch (error) {
      assert.strictEqual(
        (error as Error).message,
        'You called "getDropdownItems(\'.fake-ember-power-select-trigger\'" but no select was found using selector ".fake-ember-power-select-trigger"',
        'elements from the dropdown should be same as passed elements',
      );
    }
  });
});
