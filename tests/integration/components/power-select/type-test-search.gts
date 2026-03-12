import { module, test } from 'qunit';
import { setupRenderingTest } from '../../../helpers';
import { render } from '@ember/test-helpers';
import { numbers } from '../../../../demo-app/utils/constants';
import { clickTrigger } from '#src/test-support/helpers.ts';
import type { TestContext } from '@ember/test-helpers';
import PowerSelect from '#src/components/power-select.gts';
import Component from '@glimmer/component';
import { restartableTask, timeout } from 'ember-concurrency';
import { fn } from '@ember/helper';
import HostWrapper from '../../../../demo-app/components/host-wrapper.gts';

interface Context extends TestContext {
  element: HTMLElement;
}

function getRootNode(element: Element): HTMLElement {
  const shadowRoot = element.querySelector('[data-host-wrapper]')?.shadowRoot;
  if (shadowRoot) {
    return shadowRoot as unknown as HTMLElement;
  }
  return element.getRootNode() as HTMLElement;
}

// Common ember-concurrency pattern: @search fires a task that updates state
// via side effects (e.g. query params, tracked properties) rather than
// returning results. The task returns TaskInstance<void>, which is a
// Promise<void> — not assignable to readonly T[] | Promise<readonly T[]>.
class MyComponent extends Component {
  numbers = numbers;
  selected: string | undefined = undefined;

  searchTask = restartableTask(async (term: string) => {
    await timeout(250);
    void term;
  });

  <template>
    <PowerSelect
      @options={{this.numbers}}
      @selected={{this.selected}}
      @onChange={{fn (mut this.selected)}}
      @search={{this.searchTask.perform}}
      as |option|
    >
      {{option}}
    </PowerSelect>
  </template>
}

module(
  'Integration | Component | Ember Power Select (Type tests - search return type)',
  function (hooks) {
    setupRenderingTest(hooks);

    test<Context>('@search accepts ember-concurrency task.perform returning void', async function (assert) {
      await render<Context>(
        <template>
          <HostWrapper><MyComponent /></HostWrapper>
        </template>,
      );

      await clickTrigger(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
      );
      assert
        .dom('.ember-power-select-option', getRootNode(this.element))
        .exists('Options render when @search uses a void-returning task');
    });
  },
);
