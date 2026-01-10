import { module, test } from 'qunit';
import { setupRenderingTest } from '../../../helpers';
import { render } from '@ember/test-helpers';
import { selectChoose, getDropdownItems } from '#src/test-support.ts';
import { numbers } from '../../../../demo-app/utils/constants';
import type { Selected } from '#src/types.ts';
import type { TestContext } from '@ember/test-helpers';
import PowerSelect from '#src/components/power-select.gts';
import { fn } from '@ember/helper';
import HostWrapper from '../../../../demo-app/components/host-wrapper.gts';

interface NumbersContext<
  IsMultiple extends boolean = false,
> extends TestContext {
  element: HTMLElement;
  numbers: typeof numbers;
  selected: Selected<string, IsMultiple>;
}

function getRootNode(element: Element): HTMLElement {
  const shadowRoot = element.querySelector('[data-host-wrapper]')?.shadowRoot;
  if (shadowRoot) {
    return shadowRoot as unknown as HTMLElement;
  }

  return element.getRootNode() as HTMLElement;
}

module('Integration | Helpers | selectChoose', function (hooks) {
  setupRenderingTest(hooks);

  test<NumbersContext>('selectChoose selects the given value on single selects', async function (assert) {
    const self = this;

    assert.expect(2);

    this.numbers = numbers;

    await render<NumbersContext>(
      <template>
        <HostWrapper>
          <PowerSelect
            @options={{self.numbers}}
            @selected={{self.selected}}
            @onChange={{fn (mut self.selected)}}
            as |option|
          >
            {{option}}
          </PowerSelect>
        </HostWrapper>
      </template>,
    );

    assert
      .dom('.ember-power-select-trigger', getRootNode(this.element))
      .hasText('', 'The select is empty');
    await selectChoose(
      getRootNode(this.element).querySelector(
        '.ember-power-select-trigger',
      ) as HTMLElement,
      'three',
    );
    assert
      .dom('.ember-power-select-trigger', getRootNode(this.element))
      .hasText('three', 'The values has been selected');
  });

  test<
    NumbersContext<true>
  >('selectChoose selects the given value on multiple selects', async function (assert) {
    const self = this;

    assert.expect(3);

    this.numbers = numbers;
    await render<NumbersContext<true>>(
      <template>
        <HostWrapper>
          <PowerSelect
            @multiple={{true}}
            @options={{self.numbers}}
            @selected={{self.selected}}
            @onChange={{fn (mut self.selected)}}
            as |option|
          >
            {{option}}
          </PowerSelect>
        </HostWrapper>
      </template>,
    );

    assert
      .dom('.ember-power-select-multiple-option', getRootNode(this.element))
      .doesNotExist('There is no selected options');
    await selectChoose(
      getRootNode(this.element).querySelector(
        '.ember-power-select-trigger',
      ) as HTMLElement,
      'three',
    );
    assert
      .dom('.ember-power-select-multiple-option ', getRootNode(this.element))
      .exists({ count: 1 }, 'There is one selected option');
    await selectChoose(
      getRootNode(this.element).querySelector(
        '.ember-power-select-trigger',
      ) as HTMLElement,
      'five',
    );
    assert
      .dom('.ember-power-select-multiple-option', getRootNode(this.element))
      .exists({ count: 2 }, 'There is one selected option');
  });
});

module('Integration | Helpers | getDropdownItems', function (hooks) {
  setupRenderingTest(hooks);

  test<NumbersContext>('getDropdownItems should give the list of items in the select dropdown', async function (assert) {
    const self = this;

    assert.expect(1);

    this.numbers = numbers;
    await render<NumbersContext>(
      <template>
        <HostWrapper>
          <PowerSelect
            @options={{self.numbers}}
            @selected={{self.selected}}
            @onChange={{fn (mut self.selected)}}
            as |option|
          >
            {{option}}
          </PowerSelect>
        </HostWrapper>
      </template>,
    );

    const options = await getDropdownItems(
      getRootNode(this.element).querySelector(
        '.ember-power-select-trigger',
      ) as HTMLElement,
    );
    assert.deepEqual(
      options,
      numbers,
      'elements from the dropdown should be same as passed elements',
    );
  });

  test<NumbersContext>('getDropdownItems should throws an error when selector is not matched', async function (assert) {
    const self = this;

    assert.expect(1);

    this.numbers = numbers;
    await render<NumbersContext>(
      <template>
        <HostWrapper>
          <PowerSelect
            @options={{self.numbers}}
            @selected={{self.selected}}
            @onChange={{fn (mut self.selected)}}
            as |option|
          >
            {{option}}
          </PowerSelect>
        </HostWrapper>
      </template>,
    );

    try {
      await getDropdownItems('.fake-ember-power-select-trigger');
    } catch (error) {
      assert.strictEqual(
        (error as Error).message,
        'You called "getDropdownItems" but no select was found',
        'elements from the dropdown should be same as passed elements',
      );
    }
  });
});
