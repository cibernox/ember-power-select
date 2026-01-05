import { module, test } from 'qunit';
import { setupRenderingTest } from '../../../helpers';
import { render, type TestContext } from '@ember/test-helpers';
import { countries, type Country } from '../../../../demo-app/utils/constants';
import type { Selected, MultipleSelected } from '#src/types.ts';
import PowerSelect from '#src/components/power-select.gts';
import { fn } from '@ember/helper';
import HostWrapper from '../../../../demo-app/components/host-wrapper.gts';

interface CountryContext extends TestContext {
  element: HTMLElement;
  foo: () => void;
  countries: typeof countries;
  country: Selected<Country>;
}

interface CountryMultipleContext extends TestContext {
  element: HTMLElement;
  foo: () => void;
  countries: typeof countries;
  country: MultipleSelected<Country>;
}

function getRootNode(element: Element): HTMLElement {
  const shadowRoot = element.querySelector('[data-host-wrapper]')?.shadowRoot;
  if (shadowRoot) {
    return shadowRoot as unknown as HTMLElement;
  }

  return element.getRootNode() as HTMLElement;
}

module(
  'Integration | Component | Ember Power Select (Customization using attrs)',
  function (hooks) {
    setupRenderingTest(hooks);

    test<CountryContext>('the `class` attribute is forwarded to the trigger element', async function (assert) {
      const self = this;

      assert.expect(1);

      this.countries = countries;
      this.country = countries[1]; // Spain

      await render<CountryContext>(
        <template>
          <HostWrapper>
            <PowerSelect
              @renderInPlace={{true}}
              class="foo"
              @options={{self.countries}}
              @selected={{self.country}}
              @onChange={{fn (mut self.country)}}
              as |country|
            >
              {{country.name}}
            </PowerSelect>
          </HostWrapper>
        </template>,
      );

      assert
        .dom('.ember-basic-dropdown-trigger', getRootNode(this.element))
        .hasClass('foo', 'Class was added.');
    });

    test<CountryContext>('trigger on single selects can be customized using triggerClass', async function (assert) {
      const self = this;

      assert.expect(1);

      this.countries = countries;
      this.country = countries[1]; // Spain

      await render<CountryContext>(
        <template>
          <HostWrapper>
            <PowerSelect
              @options={{self.countries}}
              @selected={{self.country}}
              @onChange={{fn (mut self.country)}}
              @triggerClass="country-single-trigger"
              as |country|
            >
              {{country.name}}
            </PowerSelect>
          </HostWrapper>
        </template>,
      );

      assert
        .dom('.ember-power-select-trigger', getRootNode(this.element))
        .hasClass('country-single-trigger', 'Class was added.');
    });

    test<CountryMultipleContext>('trigger on multiple selects can be customized using @triggerClass', async function (assert) {
      const self = this;

      assert.expect(1);

      this.countries = countries;
      if (countries[1] && countries[0]) {
        this.country = [countries[1], countries[0]];
      }

      await render<CountryMultipleContext>(
        <template>
          <HostWrapper>
            <PowerSelect
              @multiple={{true}}
              @options={{self.countries}}
              @selected={{self.country}}
              @onChange={{fn (mut self.country)}}
              @triggerClass="country-multiple-trigger"
              as |country|
            >
              {{country.name}}
            </PowerSelect>
          </HostWrapper>
        </template>,
      );

      assert
        .dom('.ember-power-select-trigger', getRootNode(this.element))
        .hasClass('country-multiple-trigger', 'Class was added.');
    });

    test<CountryContext>('Trigger can have a custom id passing `@triggerId`', async function (assert) {
      const self = this;

      assert.expect(1);

      this.countries = countries;
      if (countries[0]) {
        this.country = countries[0];
      }
      this.foo = () => {};

      await render<CountryContext>(
        <template>
          <HostWrapper>
            <PowerSelect
              @options={{self.countries}}
              @selected={{self.country}}
              @onChange={{self.foo}}
              @triggerId="this-is-my-id"
              as |country|
            >
              {{country.name}}
            </PowerSelect>
          </HostWrapper>
        </template>,
      );

      assert
        .dom('.ember-power-select-trigger', getRootNode(this.element))
        .hasAttribute('id', 'this-is-my-id', 'The `id` was added.');
    });

    test<CountryMultipleContext>('Trigger can have a custom id passing `@triggerId` (multiple select)', async function (assert) {
      const self = this;

      assert.expect(1);

      this.countries = countries;
      if (countries[1] && countries[0]) {
        this.country = [countries[1], countries[0]];
      }

      await render<CountryMultipleContext>(
        <template>
          <HostWrapper>
            <PowerSelect
              @multiple={{true}}
              @options={{self.countries}}
              @selected={{self.country}}
              @onChange={{fn (mut self.country)}}
              @triggerId="this-is-my-id"
              as |country|
            >
              {{country.name}}
            </PowerSelect>
          </HostWrapper>
        </template>,
      );

      assert
        .dom('.ember-power-select-trigger', getRootNode(this.element))
        .hasAttribute('id', 'this-is-my-id', 'The `id` was added.');
    });
  },
);
