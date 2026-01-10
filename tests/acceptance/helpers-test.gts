import { test, module } from 'qunit';
import { setupRenderingTest } from '../helpers';
import { render, click, type TestContext } from '@ember/test-helpers';
import {
  selectChoose,
  selectSearch,
  removeMultipleOption,
  clearSelected,
} from '#src/test-support.ts';
import HelpersTesting from '../../demo-app/components/helpers-testing';
import HelpersTestingSinglePowerSelect from '../../demo-app/components/helpers-testing-single-power-select';
import HostWrapper from '../../demo-app/components/host-wrapper.gts';

interface ExtendedTestContext extends TestContext {
  element: HTMLElement;
}

function getRootNode(element: Element): HTMLElement {
  const shadowRoot = element.querySelector('[data-host-wrapper]')?.shadowRoot;
  if (shadowRoot) {
    return shadowRoot as unknown as HTMLElement;
  }

  return element.getRootNode() as HTMLElement;
}

module('Acceptance | helpers | selectChoose', function (hooks) {
  setupRenderingTest(hooks);

  test<ExtendedTestContext>('selectChoose helper opens the select and selects the option with the given text', async function (assert) {
    await render<ExtendedTestContext>(
      <template>
        <HostWrapper><HelpersTesting /></HostWrapper>
      </template>,
    );

    await selectChoose(
      getRootNode(this.element).querySelector('.select-choose') as HTMLElement,
      'three',
    );

    assert
      .dom(
        '.select-choose .ember-power-select-trigger',
        getRootNode(this.element),
      )
      .hasText('three', 'The proper value has been selected');
    assert
      .dom('.ember-power-select-options', getRootNode(this.element))
      .doesNotExist('The selectis closed');
    assert
      .dom('.select-choose-target', getRootNode(this.element))
      .hasText("You've selected: three");
  });

  test<ExtendedTestContext>('selectChoose selects the option with the given text on an already opened select', async function (assert) {
    await render<ExtendedTestContext>(
      <template>
        <HostWrapper><HelpersTesting /></HostWrapper>
      </template>,
    );

    await click(
      getRootNode(this.element).querySelector(
        '.select-choose .ember-power-select-trigger',
      ) as HTMLElement,
    );

    await selectChoose(
      getRootNode(this.element).querySelector('.select-choose') as HTMLElement,
      'three',
    );
    assert
      .dom(
        '.select-choose .ember-power-select-trigger',
        getRootNode(this.element),
      )
      .hasText('three', 'The proper value has been selected');
    assert
      .dom('.ember-power-select-options', getRootNode(this.element))
      .doesNotExist('The selectis closed');
    assert
      .dom('.select-choose-target', getRootNode(this.element))
      .hasText("You've selected: three");
  });

  test<ExtendedTestContext>('the selectChoose helper works with an onopen function that fetches data async on single selects', async function (assert) {
    await render<ExtendedTestContext>(
      <template>
        <HostWrapper><HelpersTesting /></HostWrapper>
      </template>,
    );

    await selectChoose(
      getRootNode(this.element).querySelector(
        '.select-choose-onopen',
      ) as HTMLElement,
      'three',
    );
    assert
      .dom(
        '.select-choose-onopen .ember-power-select-trigger',
        getRootNode(this.element),
      )
      .containsText('three', 'The proper value has been selected');
    assert
      .dom('.ember-power-select-options', getRootNode(this.element))
      .doesNotExist('The select is closed');
    assert
      .dom('.select-choose-target', getRootNode(this.element))
      .hasText("You've selected: three");
  });

  test<ExtendedTestContext>('the selectChoose helper works with an onopen function that fetches data async on multiple selects', async function (assert) {
    await render<ExtendedTestContext>(
      <template>
        <HostWrapper><HelpersTesting /></HostWrapper>
      </template>,
    );

    await selectChoose(
      getRootNode(this.element).querySelector(
        '.select-choose-onopen-multiple',
      ) as HTMLElement,
      'three',
    );
    assert
      .dom(
        '.select-choose-onopen-multiple .ember-power-select-multiple-option',
        getRootNode(this.element),
      )
      .exists({ count: 1 }, 'One options has been selected');
    assert
      .dom(
        '.select-choose-onopen-multiple .ember-power-select-multiple-option',
        getRootNode(this.element),
      )
      .containsText('three', 'The proper value has been selected');
    assert
      .dom('.ember-power-select-options', getRootNode(this.element))
      .doesNotExist('The selectis closed');
  });

  test<ExtendedTestContext>('the selectChoose helper works when it receives the class of the trigger', async function (assert) {
    await render<ExtendedTestContext>(
      <template>
        <HostWrapper><HelpersTesting /></HostWrapper>
      </template>,
    );

    await selectChoose(
      getRootNode(this.element).querySelector(
        '.select-with-class-in-trigger',
      ) as HTMLElement,
      'three',
    );
    assert
      .dom('.select-with-class-in-trigger', getRootNode(this.element))
      .hasText('three', 'The proper value has been selected');
    assert
      .dom('.ember-power-select-options', getRootNode(this.element))
      .doesNotExist('The selectis closed');
    assert
      .dom('.select-choose-target', getRootNode(this.element))
      .hasText("You've selected: three");
  });

  test<ExtendedTestContext>('the selectChoose helper works when it receives the css selector of the chosen option as second arguments', async function (assert) {
    await render<ExtendedTestContext>(
      <template>
        <HostWrapper><HelpersTesting /></HostWrapper>
      </template>,
    );

    await selectChoose(
      getRootNode(this.element).querySelector(
        '.select-with-class-in-trigger',
      ) as HTMLElement,
      '.ember-power-select-option:nth-child(3)',
    );
    assert
      .dom('.select-choose', getRootNode(this.element))
      .hasText('three', 'The proper value has been selected');
    assert
      .dom('.ember-power-select-options', getRootNode(this.element))
      .doesNotExist('The selectis closed');
    assert
      .dom('.select-choose-target', getRootNode(this.element))
      .hasText("You've selected: three");
  });

  test<ExtendedTestContext>('the selectChoose helper works when it receives a wildcard css class', async function (assert) {
    await render<ExtendedTestContext>(
      <template>
        <HostWrapper><HelpersTestingSinglePowerSelect /></HostWrapper>
      </template>,
    );

    await selectChoose(
      getRootNode(this.element).querySelector('*') as HTMLElement,
      'three',
    );
    assert
      .dom('.select-choose', getRootNode(this.element))
      .hasText('three', 'The proper value has been selected');
    assert
      .dom('.ember-power-select-options', getRootNode(this.element))
      .doesNotExist('The selectis closed');
    assert
      .dom('.select-choose-target', getRootNode(this.element))
      .hasText("You've selected: three");
  });

  test<ExtendedTestContext>('the selectChoose helper works when it receives a HTMLElement as first argument', async function (assert) {
    await render<ExtendedTestContext>(
      <template>
        <HostWrapper><HelpersTesting /></HostWrapper>
      </template>,
    );

    await selectChoose(
      getRootNode(this.element).querySelector(
        '.select-with-class-in-trigger',
      ) as HTMLElement,
      'three',
    );
    assert
      .dom('.select-choose', getRootNode(this.element))
      .hasText('three', 'The proper value has been selected');
    assert
      .dom('.ember-power-select-options', getRootNode(this.element))
      .doesNotExist('The selectis closed');
    assert
      .dom('.select-choose-target', getRootNode(this.element))
      .hasText("You've selected: three");
  });

  test<ExtendedTestContext>('the selectChoose helper can receive a number as third argument to select the :nth option', async function (assert) {
    await render<ExtendedTestContext>(
      <template>
        <HostWrapper><HelpersTesting /></HostWrapper>
      </template>,
    );

    await selectChoose(
      getRootNode(this.element).querySelector(
        '.select-with-class-in-trigger',
      ) as HTMLElement,
      '.ember-power-select-option',
      2,
    );
    assert
      .dom('.select-choose', getRootNode(this.element))
      .hasText('three', 'The proper value has been selected');
    assert
      .dom('.ember-power-select-options', getRootNode(this.element))
      .doesNotExist('The selectis closed');
    assert
      .dom('.select-choose-target', getRootNode(this.element))
      .hasText("You've selected: three");
  });

  test<ExtendedTestContext>('selectChoose helper throws an explicative error when no select is found in the given scope', async function (assert) {
    await render<ExtendedTestContext>(
      <template>
        <HostWrapper><HelpersTesting /></HostWrapper>
      </template>,
    );

    try {
      await selectChoose('.there-is-no-select', 'three');
    } catch (error) {
      assert.strictEqual(
        (error as Error).message,
        'You called "selectChoose" with \'three\' but no select was found',
      );
    }
  });

  test<ExtendedTestContext>('selectChoose helper throws an explicative error when no option matches the given value', async function (assert) {
    await render<ExtendedTestContext>(
      <template>
        <HostWrapper><HelpersTesting /></HostWrapper>
      </template>,
    );

    try {
      await selectChoose(
        getRootNode(this.element).querySelector(
          '.select-choose',
        ) as HTMLElement,
        'non-existent-option',
      );
    } catch (error) {
      assert.strictEqual(
        (error as Error).message,
        "You called \"selectChoose\" with 'non-existent-option' but \"non-existent-option\" didn't match any option",
      );
    }
  });
});

module('Acceptance | helpers | selectSearch', function (hooks) {
  setupRenderingTest(hooks);

  test<ExtendedTestContext>('selectSearch helper searches in the given single select if it is already opened', async function (assert) {
    await render<ExtendedTestContext>(
      <template>
        <HostWrapper><HelpersTesting /></HostWrapper>
      </template>,
    );

    await click(
      getRootNode(this.element).querySelector(
        '.select-async .ember-power-select-trigger',
      ) as HTMLElement,
    );
    await selectSearch(
      getRootNode(this.element).querySelector('.select-async') as HTMLElement,
      'three',
    );
    assert
      .dom('.ember-power-select-options', getRootNode(this.element))
      .hasText('three');
  });

  test<ExtendedTestContext>('selectSearch helper searches an opened select if using a wildcard css selector', async function (assert) {
    await render<ExtendedTestContext>(
      <template>
        <HostWrapper><HelpersTestingSinglePowerSelect /></HostWrapper>
      </template>,
    );

    await click(
      getRootNode(this.element).querySelector(
        '.ember-power-select-trigger',
      ) as HTMLElement,
    );
    await selectSearch(
      getRootNode(this.element).querySelector('*') as HTMLElement,
      'three',
    );
    assert
      .dom('.ember-power-select-options', getRootNode(this.element))
      .hasText('three');
  });

  test<ExtendedTestContext>('selectSearch helper opens and searches select if using a wildcard css selector', async function (assert) {
    await render<ExtendedTestContext>(
      <template>
        <HostWrapper><HelpersTestingSinglePowerSelect /></HostWrapper>
      </template>,
    );

    await click(
      getRootNode(this.element).querySelector(
        '.ember-power-select-trigger',
      ) as HTMLElement,
    );
    await selectSearch(
      getRootNode(this.element).querySelector('*') as HTMLElement,
      'three',
    );
    assert
      .dom('.ember-power-select-options', getRootNode(this.element))
      .hasText('three');
  });

  test<ExtendedTestContext>('selectSearch helper searches in the given single select, opening it if needed', async function (assert) {
    await render<ExtendedTestContext>(
      <template>
        <HostWrapper><HelpersTesting /></HostWrapper>
      </template>,
    );

    await selectSearch(
      getRootNode(this.element).querySelector('.select-async') as HTMLElement,
      'three',
    );
    assert
      .dom('.ember-power-select-options', getRootNode(this.element))
      .hasText('three');
  });

  test<ExtendedTestContext>('selectSearch helper searches in the given multiple select opened', async function (assert) {
    await render<ExtendedTestContext>(
      <template>
        <HostWrapper><HelpersTesting /></HostWrapper>
      </template>,
    );

    await click(
      getRootNode(this.element).querySelector(
        '.select-multiple .ember-power-select-trigger',
      ) as HTMLElement,
    );
    await selectSearch(
      getRootNode(this.element).querySelector(
        '.select-multiple',
      ) as HTMLElement,
      'three',
    );
    assert
      .dom('.ember-power-select-options', getRootNode(this.element))
      .hasText('three');
  });

  test<ExtendedTestContext>('selectSearch helper searches in the given multiple select closed', async function (assert) {
    await render<ExtendedTestContext>(
      <template>
        <HostWrapper><HelpersTesting /></HostWrapper>
      </template>,
    );

    await selectSearch(
      getRootNode(this.element).querySelector(
        '.select-multiple',
      ) as HTMLElement,
      'three',
    );
    assert
      .dom('.ember-power-select-options', getRootNode(this.element))
      .hasText('three');
  });

  test<ExtendedTestContext>('selectSearch helper works even with custom components as long as the input has [type=search]', async function (assert) {
    await render<ExtendedTestContext>(
      <template>
        <HostWrapper><HelpersTesting /></HostWrapper>
      </template>,
    );

    await click(
      getRootNode(this.element).querySelector(
        '.select-custom-search .ember-power-select-trigger',
      ) as HTMLElement,
    );
    await selectSearch(
      getRootNode(this.element).querySelector(
        '.select-custom-search',
      ) as HTMLElement,
      'three',
    );
    assert
      .dom('.ember-power-select-options', getRootNode(this.element))
      .hasText('three');
  });

  test<ExtendedTestContext>('selectSearch helper can receive the HTMLElement of the trigger as first arguments', async function (assert) {
    await render<ExtendedTestContext>(
      <template>
        <HostWrapper><HelpersTesting /></HostWrapper>
      </template>,
    );

    await selectSearch(
      getRootNode(this.element).querySelector(
        '.select-multiple .ember-power-select-trigger',
      ) as HTMLElement,
      'three',
    );
    assert
      .dom('.ember-power-select-options', getRootNode(this.element))
      .hasText('three');
  });

  test<ExtendedTestContext>('the selectSearch helper works when it receives the class of the trigger', async function (assert) {
    await render<ExtendedTestContext>(
      <template>
        <HostWrapper><HelpersTesting /></HostWrapper>
      </template>,
    );

    await selectSearch(
      getRootNode(this.element).querySelector(
        '.select-with-class-in-trigger',
      ) as HTMLElement,
      'three',
    );
    assert
      .dom('.ember-power-select-options', getRootNode(this.element))
      .hasText('three');
  });

  test<ExtendedTestContext>('the selectSearch helper throws an explicative error when no select is found in the given scope', async function (assert) {
    await render<ExtendedTestContext>(
      <template>
        <HostWrapper><HelpersTesting /></HostWrapper>
      </template>,
    );

    try {
      await selectSearch('.there-is-no-select', 'three');
    } catch (error) {
      assert.strictEqual(
        (error as Error).message,
        'You called "selectSearch" with \'three\' but no select was found',
      );
    }
  });
});

module('Acceptance | helpers | removeMultipleOption', function (hooks) {
  setupRenderingTest(hooks);

  test<ExtendedTestContext>('removeMultipleOption removes selected option', async function (assert) {
    await render<ExtendedTestContext>(
      <template>
        <HostWrapper><HelpersTesting /></HostWrapper>
      </template>,
    );

    await selectChoose(
      getRootNode(this.element).querySelector(
        '.select-choose-onopen-multiple',
      ) as HTMLElement,
      'three',
    );
    await selectChoose(
      getRootNode(this.element).querySelector(
        '.select-choose-onopen-multiple',
      ) as HTMLElement,
      'four',
    );
    assert
      .dom(
        '.select-choose-onopen-multiple .ember-power-select-trigger > .ember-power-select-multiple-options > li',
        getRootNode(this.element),
      )
      .exists({ count: 2 }, 'Multiple options selected');

    await removeMultipleOption(
      '.select-choose-onopen-multiple',
      'three',
      getRootNode(this.element),
    );
    assert
      .dom(
        '.select-choose-onopen-multiple .ember-power-select-trigger > .ember-power-select-multiple-options > li',
        getRootNode(this.element),
      )
      .exists({ count: 1 }, 'One option removed');

    await removeMultipleOption(
      '.select-choose-onopen-multiple',
      'four',
      getRootNode(this.element),
    );
    assert
      .dom(
        '.select-choose-onopen-multiple .ember-power-select-trigger > .ember-power-select-multiple-options > li',
      )
      .exists({ count: 0 }, 'Last option removed');
  });

  test<ExtendedTestContext>('removeMultipleOption works with async onchange action', async function (assert) {
    await render<ExtendedTestContext>(
      <template>
        <HostWrapper><HelpersTesting /></HostWrapper>
      </template>,
    );

    await selectChoose(
      getRootNode(this.element).querySelector(
        '#select-multiple-async',
      ) as HTMLElement,
      'three',
    );
    await selectChoose(
      getRootNode(this.element).querySelector(
        '#select-multiple-async',
      ) as HTMLElement,
      'four',
    );
    assert
      .dom(
        '#select-multiple-async .ember-power-select-multiple-option',
        getRootNode(this.element),
      )
      .exists({ count: 2 }, 'Multiple options selected');

    await removeMultipleOption(
      '#select-multiple-async',
      'three',
      getRootNode(this.element),
    );
    assert
      .dom(
        '#select-multiple-async .ember-power-select-multiple-option',
        getRootNode(this.element),
      )
      .exists({ count: 1 }, 'One option removed');
  });
});

module('Acceptance | helpers | clearSelected', function (hooks) {
  setupRenderingTest(hooks);

  test<ExtendedTestContext>('clearSelected removes selected option', async function (assert) {
    await render<ExtendedTestContext>(
      <template>
        <HostWrapper><HelpersTesting /></HostWrapper>
      </template>,
    );

    assert
      .dom(
        '.select-choose-onopen .ember-power-select-clear-btn',
        getRootNode(this.element),
      )
      .doesNotExist();

    await selectChoose(
      getRootNode(this.element).querySelector(
        '.select-choose-onopen',
      ) as HTMLElement,
      'three',
    );
    assert
      .dom(
        '.select-choose-onopen .ember-power-select-clear-btn',
        getRootNode(this.element),
      )
      .exists();
    assert
      .dom(
        '.select-choose-onopen .ember-power-select-selected-item',
        getRootNode(this.element),
      )
      .hasText('three', 'The proper value has been selected');

    await clearSelected('.select-choose-onopen', getRootNode(this.element));
    assert
      .dom(
        '.select-choose-onopen .ember-power-select-clear-btn',
        getRootNode(this.element),
      )
      .doesNotExist();
  });

  test<ExtendedTestContext>('clearSelected works with async onchange action', async function (assert) {
    await render<ExtendedTestContext>(
      <template>
        <HostWrapper><HelpersTesting /></HostWrapper>
      </template>,
    );

    assert
      .dom(
        '.select-deselect-async .ember-power-select-clear-btn',
        getRootNode(this.element),
      )
      .doesNotExist();

    await selectChoose(
      getRootNode(this.element).querySelector(
        '.select-deselect-async',
      ) as HTMLElement,
      'three',
    );
    assert
      .dom(
        '.select-deselect-async .ember-power-select-clear-btn',
        getRootNode(this.element),
      )
      .exists();
    assert
      .dom(
        '.select-deselect-async .ember-power-select-selected-item',
        getRootNode(this.element),
      )
      .hasText('three', 'The proper value has been selected');

    await clearSelected('.select-deselect-async', getRootNode(this.element));
    assert
      .dom(
        '.select-deselect-async .ember-power-select-clear-btn',
        getRootNode(this.element),
      )
      .doesNotExist();
  });
});
