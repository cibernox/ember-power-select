import { module, test } from 'qunit';
import { setupRenderingTest } from 'test-app/tests/helpers';
import { render, click, focus, type TestContext } from '@ember/test-helpers';
import { countries, groupedNumbers, type Country, type GroupedNumber, type SelectedCountryExtra } from 'test-app/utils/constants';
import { clickTrigger } from 'ember-power-select/test-support/helpers';
import { isPresent } from '@ember/utils';
import type { PowerSelectAfterOptionsSignature, PowerSelectSelectedItemSignature, Select, Selected } from 'ember-power-select/types';
import SelectedCountry from 'test-app/components/selected-country';
import type { ComponentLike } from '@glint/template';
import type { PowerSelectTriggerSignature } from 'ember-power-select/components/power-select/trigger';
import CustomTrigger from 'test-app/components/custom-trigger-component';
import SelectedItemCountry from 'test-app/components/selected-item-country';
import ListOfCountries from 'test-app/components/list-of-countries';
import type { PowerSelectOptionsSignature } from 'ember-power-select/components/power-select/options';
import CustomBeforeOptions from 'test-app/components/custom-before-options';
import type { PowerSelectBeforeOptionsSignature } from 'ember-power-select/components/power-select/before-options';
import PowerSelectPlaceholder, { type PowerSelectPlaceholderSignature } from 'ember-power-select/components/power-select/placeholder';
import CustomAfterOptions from 'test-app/components/custom-after-options';
import CustomAfterOptionsTwo from 'test-app/components/custom-after-options-two';
import CustomBeforeOptionsTwo from 'test-app/components/custom-before-options-two';
import CustomTriggerThatHandlesFocus from 'test-app/components/custom-trigger-that-handles-focus';
import CustomSearchMessage from 'test-app/components/custom-search-message';
import type { PowerSelectSearchMessageSignature } from 'ember-power-select/components/power-select/search-message';
import CustomNoMatchesMessage from 'test-app/components/custom-no-matches-message';
import type { PowerSelectNoMatchesMessageSignature } from 'ember-power-select/components/power-select/no-matches-message';
import CustomPlaceholder from 'test-app/components/custom-placeholder';
import CustomGroupComponent from 'test-app/components/custom-group-component';
import type { PowerSelectPowerSelectGroupSignature } from 'ember-power-select/components/power-select/power-select-group';
import CustomLabelComponent from 'test-app/components/custom-label-component';
import type { PowerSelectLabelSignature } from 'ember-power-select/components/power-select/label';
import CustomMultipleSearchPlaceholder from 'test-app/components/custom-multiple-search-placeholder';
import CustomMultipleBeforeOptions from 'test-app/components/custom-multiple-before-options';
import PowerSelect from "ember-power-select/components/power-select";
import { fn, hash } from "@ember/helper";
import PowerSelectMultiple from "ember-power-select/components/power-select-multiple";

interface CountryContext<
  IsMultiple extends boolean = false,
> extends TestContext {
  foo: () => void;
  countries: typeof countries;
  country: Selected<Country, IsMultiple>;
  searchFn: () => typeof countries;
  someAction: () => void;
  didFocusInside: (select: Select<Country>, event: FocusEvent) => void;
  triggerComponent: ComponentLike<
    PowerSelectTriggerSignature<Country, SelectedCountryExtra, IsMultiple>
  >;
  selectedItemComponent: ComponentLike<
    PowerSelectSelectedItemSignature<Country, SelectedCountryExtra, IsMultiple>
  >;
  optionsComponent: ComponentLike<
    PowerSelectOptionsSignature<Country, SelectedCountryExtra, IsMultiple>
  >;
  beforeOptionsComponent: ComponentLike<
    PowerSelectBeforeOptionsSignature<Country, SelectedCountryExtra, IsMultiple>
  >;
  placeholderComponent: ComponentLike<
    PowerSelectPlaceholderSignature<Country, SelectedCountryExtra, IsMultiple>
  >;
  afterOptionsComponent: ComponentLike<
    PowerSelectAfterOptionsSignature<Country, SelectedCountryExtra, IsMultiple>
  >;
  searchMessageComponent: ComponentLike<
    PowerSelectSearchMessageSignature<Country, SelectedCountryExtra, IsMultiple>
  >;
  noMatchesMessageComponent: ComponentLike<
    PowerSelectNoMatchesMessageSignature<
      Country,
      SelectedCountryExtra,
      IsMultiple
    >
  >;
  labelComponent: ComponentLike<
    PowerSelectLabelSignature<Country, SelectedCountryExtra, IsMultiple>
  >;
  extra?: SelectedCountryExtra;
}

interface GroupedNumbersExtra {
  foo: string;
}

interface GroupedNumbersContext<
  IsMultiple extends boolean = false,
> extends TestContext {
  foo: (selected: string | undefined) => void;
  groupedNumbers: GroupedNumber[];
  extra?: GroupedNumbersExtra;
  onInit?: () => void;
  groupComponent: ComponentLike<
    PowerSelectPowerSelectGroupSignature<
      GroupedNumber,
      GroupedNumbersExtra,
      IsMultiple
    >
  >;
}

module(
  'Integration | Component | Ember Power Select (Customization using components)',
  function (hooks) {
    setupRenderingTest(hooks);

    test<CountryContext>('selected option can be customized using triggerComponent', async function (assert) {const self = this;

      assert.expect(3);

      this.countries = countries;
      this.country = countries[1]; // Spain
      this.triggerComponent = SelectedCountry;

      await render<CountryContext>(<template>
      <PowerSelect @options={{self.countries}} @selected={{self.country}} @triggerComponent={{self.triggerComponent}} @onChange={{fn (mut self.country)}} as |country|>
        {{country.name}}
      </PowerSelect>
    </template>);

      assert
        .dom('.ember-power-select-status-icon')
        .doesNotExist('The provided trigger component is not rendered');
      assert
        .dom('.ember-power-select-trigger .icon-flag')
        .exists('The custom flag appears.');
      assert
        .dom('.ember-power-select-trigger')
        .hasText('Spain', 'With the country name as the text.');
    });

    test<CountryContext>('triggerComponent receives loading message', async function (assert) {const self = this;

      assert.expect(1);
      this.countries = countries;
      this.triggerComponent = CustomTrigger;
      this.foo = () => {};

      await render<CountryContext>(<template>
      <PowerSelect @options={{self.countries}} @loadingMessage="hmmmm paella" @selected={{self.country}} @triggerComponent={{self.triggerComponent}} @onChange={{self.foo}} as |country|>
        {{country.name}}
      </PowerSelect>
    </template>);
      assert
        .dom('.custom-trigger-component')
        .hasText(
          'hmmmm paella',
          'The loading message is passed to the trigger component',
        );
    });

    test<CountryContext>('selected item option can be customized using `@selectedItemComponent`', async function (assert) {const self = this;

      assert.expect(3);

      this.countries = countries;
      this.country = countries[1]; // Spain
      this.selectedItemComponent = SelectedItemCountry;

      await render<CountryContext>(<template>
      <PowerSelect @options={{self.countries}} @selected={{self.country}} @selectedItemComponent={{self.selectedItemComponent}} @onChange={{fn (mut self.country)}} as |country|>
        {{country.name}}
      </PowerSelect>
    </template>);

      assert
        .dom('.ember-power-select-status-icon')
        .exists('The provided trigger component is rendered');
      assert
        .dom('.ember-power-select-trigger .icon-flag')
        .exists('The custom flag appears.');
      assert
        .dom('.ember-power-select-trigger')
        .hasText('Spain', 'With the country name as the text.');
    });

    test<CountryContext>('the list of options can be customized using `@optionsComponent`', async function (assert) {const self = this;

      assert.expect(2);

      this.countries = countries;
      this.country = countries[1]; // Spain
      this.optionsComponent = ListOfCountries;

      await render<CountryContext>(<template>
      <PowerSelect @options={{self.countries}} @selected={{self.country}} @optionsComponent={{self.optionsComponent}} @onChange={{fn (mut self.country)}} as |country|>
        {{country.name}}
      </PowerSelect>
    </template>);

      await clickTrigger();
      assert
        .dom('.ember-power-select-options')
        .includesText('Countries:', 'The given component is rendered');
      assert
        .dom('.ember-power-select-options')
        .includesText('3. Russia', 'The component has access to the options');
    });

    test<CountryContext>('the `@optionsComponent` receives the `@extra` hash', async function (assert) {const self = this;

      assert.expect(2);

      this.countries = countries;
      this.country = countries[1]; // Spain
      this.optionsComponent = ListOfCountries;

      await render<CountryContext>(<template>
      <PowerSelect @options={{self.countries}} @selected={{self.country}} @optionsComponent={{self.optionsComponent}} @onChange={{fn (mut self.country)}} @extra={{hash field="code"}} as |country|>
        {{country.code}}
      </PowerSelect>
    </template>);

      await clickTrigger();
      assert
        .dom('.ember-power-select-options')
        .includesText('Countries:', 'The given component is rendered');
      assert
        .dom('.ember-power-select-options')
        .includesText(
          '3. RU',
          'The component uses the field in the extra has to render the options',
        );
    });

    test<CountryContext>('the content before the list can be customized passing `@beforeOptionsComponent`', async function (assert) {const self = this;

      assert.expect(4);

      this.countries = countries;
      this.country = countries[1]; // Spain
      this.beforeOptionsComponent = CustomBeforeOptions;
      this.placeholderComponent = PowerSelectPlaceholder;

      await render<CountryContext>(<template>
      <PowerSelect @selected={{self.country}} @beforeOptionsComponent={{self.beforeOptionsComponent}} @options={{self.countries}} @placeholder="inception" @placeholderComponent={{self.placeholderComponent}} @onChange={{fn (mut self.country)}} as |country|>
        {{country.name}}
      </PowerSelect>
    </template>);

      await clickTrigger();
      assert
        .dom('.ember-power-select-dropdown #custom-before-options-p-tag')
        .exists(
          'The custom component is rendered instead of the usual search bar',
        );
      assert
        .dom('.ember-power-select-dropdown #custom-before-options-p-tag')
        .hasText('inception', 'The placeholder attribute is passed through.');
      assert
        .dom('.ember-power-select-dropdown .ember-power-select-placeholder')
        .exists('The placeholder component is passed through.');
      assert
        .dom('.ember-power-select-search-input')
        .doesNotExist('The search input is not visible');
    });

    test<CountryContext>('the content after the list can be customized passing `@afterOptionsComponent`', async function (assert) {const self = this;

      assert.expect(2);

      this.countries = countries;
      this.country = countries[1]; // Spain
      this.afterOptionsComponent = CustomAfterOptions;

      await render<CountryContext>(<template>
      <PowerSelect @options={{self.countries}} @selected={{self.country}} @afterOptionsComponent={{self.afterOptionsComponent}} @onChange={{fn (mut self.country)}} @searchEnabled={{true}} as |country|>
        {{country.name}}
      </PowerSelect>
    </template>);

      await clickTrigger();
      assert
        .dom('.ember-power-select-dropdown #custom-after-options-p-tag')
        .exists(
          'The custom component is rendered instead of the usual search bar',
        );
      assert
        .dom('.ember-power-select-search-input')
        .exists('The search input is still visible');
    });

    test<CountryContext>('the `@beforeOptionsComponent` and `@afterOptionsComponent` receive the `@extra` hash', async function (assert) {const self = this;

      assert.expect(1);

      let counter = 0;
      this.countries = countries;
      this.country = countries[1]; // Spain
      this.someAction = function () {
        counter++;
      };
      this.afterOptionsComponent = CustomAfterOptionsTwo;
      this.beforeOptionsComponent = CustomBeforeOptionsTwo;

      await render<CountryContext>(<template>
      <PowerSelect @options={{self.countries}} @selected={{self.country}} @onChange={{fn (mut self.country)}} @afterOptionsComponent={{self.afterOptionsComponent}} @beforeOptionsComponent={{self.beforeOptionsComponent}} @extra={{hash passedAction=self.someAction}} as |country|>
        {{country.name}}
      </PowerSelect>
    </template>);

      await clickTrigger();
      await click('.custom-before-options2-button');
      await click('.custom-after-options2-button');
      assert.strictEqual(
        counter,
        2,
        'The action inside the extra hash has been called twice',
      );
    });

    test<CountryContext>('the `@triggerComponent` receives the `@onFocus` action that triggers it', async function (assert) {const self = this;

      assert.expect(9);

      this.countries = countries;
      this.country = countries[1]; // Spain
      this.triggerComponent = CustomTriggerThatHandlesFocus;
      this.didFocusInside = function (
        select: Select<Country>,
        event: FocusEvent,
      ) {
        assert.strictEqual(
          typeof select.isOpen,
          'boolean',
          'select.isOpen is a boolean',
        );
        assert.strictEqual(
          typeof select.searchText,
          'string',
          'select.searchText is a string',
        );
        assert.strictEqual(
          typeof select.actions.open,
          'function',
          'select.actions.open is a function',
        );
        assert.strictEqual(
          typeof select.actions.close,
          'function',
          'select.actions.close is a function',
        );
        assert.strictEqual(
          typeof select.actions.reposition,
          'function',
          'select.actions.reposition is a function',
        );
        assert.strictEqual(
          typeof select.actions.search,
          'function',
          'select.actions.search is a function',
        );
        assert.strictEqual(
          typeof select.actions.highlight,
          'function',
          'select.actions.highlight is a function',
        );
        assert.strictEqual(
          typeof select.actions.select,
          'function',
          'select.actions.select is a function',
        );
        assert.ok(
          event instanceof window.Event,
          'The second argument is an event',
        );
      };

      await render<CountryContext>(<template>
      <PowerSelect @options={{self.countries}} @selected={{self.country}} @onChange={{fn (mut self.country)}} @triggerComponent={{self.triggerComponent}} @onFocus={{self.didFocusInside}} as |country|>
        {{country.name}}
      </PowerSelect>
    </template>);

      await focus('#focusable-input');
    });

    test<CountryContext>('the search message can be customized passing `@searchMessageComponent`', async function (assert) {const self = this;

      assert.expect(1);

      this.searchFn = () => [];
      this.foo = () => {};
      this.searchMessageComponent = CustomSearchMessage;
      await render<CountryContext>(<template>
      <PowerSelect @search={{self.searchFn}} @searchMessageComponent={{self.searchMessageComponent}} @onChange={{self.foo}} as |country|>
        {{country.name}}
      </PowerSelect>
    </template>);

      await clickTrigger();
      assert
        .dom('.ember-power-select-dropdown #custom-search-message-p-tag')
        .exists(
          'The custom component is rendered instead of the usual message',
        );
    });

    test<CountryContext>('the no matches element can be customized passing `@noMatchesMessageComponent`', async function (assert) {const self = this;

      assert.expect(2);

      this.countries = [];
      this.foo = () => {};
      this.noMatchesMessageComponent = CustomNoMatchesMessage;

      await render<CountryContext>(<template>
      <PowerSelect @options={{self.countries}} @noMatchesMessageComponent={{self.noMatchesMessageComponent}} @noMatchesMessage="Nope" @onChange={{self.foo}} as |option|>
        {{option.name}}
      </PowerSelect>
    </template>);

      await clickTrigger();

      assert
        .dom('.ember-power-select-dropdown #custom-no-matches-message-p-tag')
        .exists(
          'The custom component is rendered instead of the usual message',
        );
      assert.dom('#custom-no-matches-message-p-tag').hasText('Nope');
    });

    test<CountryContext>('placeholder can be customized using `@placeholderComponent`', async function (assert) {const self = this;

      assert.expect(2);

      this.countries = countries;
      this.foo = () => {};
      this.placeholderComponent = CustomPlaceholder;

      await render<CountryContext>(<template>
      <PowerSelect @options={{self.countries}} @placeholder="test" @placeholderComponent={{self.placeholderComponent}} @onChange={{self.foo}} as |country|>
        {{country.name}}
      </PowerSelect>
    </template>);

      assert
        .dom('.ember-power-select-placeholder')
        .exists('The placeholder appears.');
      assert
        .dom('.ember-power-select-placeholder')
        .hasText(
          'This is a very bold placeholder',
          'The placeholder content is equal.',
        );
    });

    test<GroupedNumbersContext>('`@groupComponent` can be overridden', async function (assert) {const self = this;

      this.groupedNumbers = groupedNumbers;
      this.foo = () => {};

      const numberOfGroups = 5; // number of groups in groupedNumber;
      this.groupComponent = CustomGroupComponent;

      await render<GroupedNumbersContext>(<template>
      <PowerSelect @options={{self.groupedNumbers}} @groupComponent={{self.groupComponent}} @onChange={{self.foo}} as |number|>
        {{number}}
      </PowerSelect>
    </template>);

      await clickTrigger();
      assert
        .dom('.ember-power-select-options .custom-component')
        .exists({ count: numberOfGroups });
    });

    test<GroupedNumbersContext>('`@groupComponent` has extension points', async function (assert) {const self = this;

      this.groupedNumbers = groupedNumbers;
      const numberOfGroups = 5; // number of groups in groupedNumbers

      const extra = { foo: 'bar' };
      this.extra = extra;
      this.foo = () => {};
      this.groupComponent = CustomGroupComponent;

      this.onInit = function (
        this: CustomGroupComponent<typeof groupedNumbers>,
      ) {
        assert.ok(isPresent(this.args.select));
        assert.ok(isPresent(this.args.group.groupName));
        assert.ok(isPresent(this.args.group.options));
        assert.strictEqual(this.args.extra, extra);
      };

      await render<GroupedNumbersContext>(<template>
      {{#let (component self.groupComponent onInit=this.onInit) as |groupComponent|}}
        <PowerSelect @options={{self.groupedNumbers}} @groupComponent={{groupComponent}} @extra={{self.extra}} @onChange={{self.foo}} as |number|>
          {{number}}
        </PowerSelect>
      {{/let}}
    </template>);

      await clickTrigger();

      assert
        .dom('.ember-power-select-options .custom-component')
        .exists({ count: numberOfGroups });
    });

    test<CountryContext>('The `@labelComponent` was rendered with text `@labelText="Label for select` and is matching with trigger id', async function (assert) {const self = this;

      assert.expect(3);

      this.countries = countries;
      this.foo = () => {};
      this.labelComponent = CustomLabelComponent;

      await render<CountryContext>(<template>
      <PowerSelect @options={{self.countries}} @labelComponent={{self.labelComponent}} @labelText="Label for select" @onChange={{self.foo}} as |country|>
        {{country.name}}
      </PowerSelect>
    </template>);

      assert
        .dom('.ember-power-select-custom-label-component')
        .exists('Label is present');

      assert
        .dom('.ember-power-select-custom-label-component')
        .hasText('Label for select');

      assert
        .dom('.ember-power-select-trigger')
        .hasAttribute(
          'id',
          document
            .querySelector('.ember-power-select-custom-label-component')
            ?.getAttribute('for') ?? '',
          'The for from label is matching with id of trigger',
        );
    });

    test<
      CountryContext<true>
    >('the power-select-multiple placeholder can be customized using `@placeholderComponent`', async function (assert) {const self = this;

      assert.expect(2);

      this.countries = countries;
      this.foo = () => {};
      this.placeholderComponent = CustomPlaceholder;

      await render<CountryContext<true>>(<template>
        <PowerSelectMultiple @options={{self.countries}} @placeholder="test" @placeholderComponent={{self.placeholderComponent}} @onChange={{self.foo}} as |country|>
          {{country.name}}
        </PowerSelectMultiple>
      </template>);

      assert
        .dom('.ember-power-select-placeholder')
        .exists('The placeholder appears.');
      assert
        .dom('.ember-power-select-placeholder')
        .hasText(
          'This is a very bold placeholder',
          'The placeholder content is equal.',
        );
    });

    test<
      CountryContext<true>
    >('the power-select-multiple placeholder can be customized using `@placeholderComponent` and work with `@searchEnabled` on `true`', async function (assert) {const self = this;

      assert.expect(2);

      this.countries = countries;
      this.placeholderComponent = CustomMultipleSearchPlaceholder;

      await render<CountryContext<true>>(<template>
        <PowerSelectMultiple @searchEnabled={{true}} @searchField="name" @options={{self.countries}} @selected={{self.country}} @placeholder="test" @placeholderComponent={{self.placeholderComponent}} @onChange={{fn (mut self.country)}} as |country|>
          {{country.name}}
        </PowerSelectMultiple>
      </template>);

      assert
        .dom('.ember-power-select-placeholder')
        .exists('The placeholder appears.');
      assert
        .dom('.ember-power-select-placeholder')
        .hasText(
          'This is a very bold placeholder',
          'The placeholder content is equal.',
        );
    });

    test<
      CountryContext<true>
    >('the power-select-multiple `optionsComponent` receives the `extra` hash', async function (assert) {const self = this;

      assert.expect(2);

      this.countries = countries;
      if (countries[1]) {
        this.country = [countries[1]]; // Spain
      }
      this.optionsComponent = ListOfCountries;

      await render<CountryContext<true>>(<template>
      <PowerSelectMultiple @options={{self.countries}} @selected={{self.country}} @optionsComponent={{self.optionsComponent}} @onChange={{fn (mut self.country)}} @extra={{hash field="code"}} as |country|>
        {{country.code}}
      </PowerSelectMultiple>
    </template>);

      await clickTrigger();

      assert
        .dom('.ember-power-select-options')
        .includesText('Countries:', 'The given component is rendered');
      assert
        .dom('.ember-power-select-options')
        .includesText(
          '3. RU',
          'The component uses the field option in the `extra` hash to render the options',
        );
    });

    test<
      CountryContext<true>
    >('the power-select-multiple `@triggerComponent` receives the `@extra` hash', async function (assert) {const self = this;

      assert.expect(1);

      this.countries = countries;
      if (countries[1]) {
        this.country = [countries[1]]; // Spain
      }

      this.triggerComponent = SelectedCountry;

      await render<CountryContext<true>>(<template>
      <PowerSelectMultiple @options={{self.countries}} @selected={{self.country}} @triggerComponent={{self.triggerComponent}} @onChange={{fn (mut self.country)}} @extra={{hash coolFlagIcon=true}} as |country|>
        {{country.code}}
      </PowerSelectMultiple>
    </template>);

      await clickTrigger();

      assert
        .dom('.ember-power-select-trigger .cool-flag-icon')
        .exists(
          { count: 1 },
          'The custom triggerComponent renders with the extra.coolFlagIcon customization option triggering some state change.',
        );
    });

    test<
      CountryContext<true>
    >('the power-select-multiple `@selectedItemComponent` receives the `extra` hash', async function (assert) {const self = this;

      assert.expect(1);

      this.countries = countries;
      if (countries[1]) {
        this.country = [countries[1]]; // Spain
      }

      this.selectedItemComponent = SelectedItemCountry;

      await render<CountryContext<true>>(<template>
      <div class="select-box">
        <PowerSelectMultiple @options={{self.countries}} @selected={{self.country}} @selectedItemComponent={{self.selectedItemComponent}} @onChange={{fn (mut self.country)}} @extra={{hash coolFlagIcon=true}} as |country|>
          {{country.code}}
        </PowerSelectMultiple>
      </div>
    </template>);

      assert
        .dom('.ember-power-select-trigger .cool-flag-icon')
        .exists(
          { count: 1 },
          'The custom selectedItemComponent renders with the extra.coolFlagIcon.',
        );
    });

    test<
      CountryContext<true>
    >('the power-select-multiple content before the list can be customized passing `@beforeOptionsComponent`, search field in trigger', async function (assert) {const self = this;

      this.countries = countries;
      if (countries[1]) {
        this.country = [countries[1]]; // Spain
      }
      this.beforeOptionsComponent = CustomMultipleBeforeOptions;

      await render<CountryContext<true>>(<template>
      <div class="select-box">
        <PowerSelectMultiple @options={{self.countries}} @selected={{self.country}} @searchEnabled={{true}} @beforeOptionsComponent={{self.beforeOptionsComponent}} @placeholder="inception" @onChange={{fn (mut self.country)}} @extra={{hash coolFlagIcon=true}} as |country|>
          {{country.code}}
        </PowerSelectMultiple>
      </div>
    </template>);

      await clickTrigger();

      assert
        .dom('.ember-power-select-trigger input')
        .exists('The search field is in trigger');

      assert
        .dom('.ember-power-select-dropdown #custom-before-options-p-tag')
        .exists(
          'The custom component is rendered instead of the usual search bar',
        );
      assert
        .dom('.ember-power-select-dropdown #custom-before-options-p-tag')
        .hasText('inception', 'The placeholder attribute is passed through.');
      assert
        .dom('.ember-power-select-dropdown .ember-power-select-placeholder')
        .exists('The placeholder component is passed through.');
      assert
        .dom('.ember-power-select-search-input')
        .doesNotExist('The search input is not visible');
      assert
        .dom('.ember-power-select-dropdown .custom-before-options-search-field')
        .doesNotExist('Custom search input is visible');
    });

    test<
      CountryContext<true>
    >('the power-select-multiple content before the list can be customized passing `@beforeOptionsComponent`, search field in before-options', async function (assert) {const self = this;

      this.countries = countries;
      if (countries[1]) {
        this.country = [countries[1]]; // Spain
      }

      this.beforeOptionsComponent = CustomMultipleBeforeOptions;

      await render<CountryContext<true>>(<template>
      <div class="select-box">
        <PowerSelectMultiple @options={{self.countries}} @selected={{self.country}} @searchEnabled={{true}} @searchFieldPosition="before-options" @beforeOptionsComponent={{self.beforeOptionsComponent}} @placeholder="inception" @onChange={{fn (mut self.country)}} @extra={{hash coolFlagIcon=true}} as |country|>
          {{country.code}}
        </PowerSelectMultiple>
      </div>
    </template>);

      await clickTrigger();

      assert
        .dom('.ember-power-select-trigger input')
        .doesNotExist('The search field is not in trigger');

      assert
        .dom('.ember-power-select-dropdown #custom-before-options-p-tag')
        .exists(
          'The custom component is rendered instead of the usual search bar',
        );
      assert
        .dom('.ember-power-select-dropdown #custom-before-options-p-tag')
        .hasText('inception', 'The placeholder attribute is passed through.');
      assert
        .dom('.ember-power-select-dropdown .ember-power-select-placeholder')
        .exists('The placeholder component is passed through.');
      assert
        .dom('.ember-power-select-search-input')
        .doesNotExist('The search input is not visible');
      assert
        .dom('.ember-power-select-dropdown .custom-before-options-search-field')
        .doesNotExist('Custom search input is visible');
    });

    test<
      CountryContext<true>
    >('The power-select-multiple `@labelComponent` was rendered with text `@labelText="Label for select` and is matching with trigger id', async function (assert) {const self = this;

      assert.expect(3);

      this.countries = countries;
      this.foo = () => {};
      this.labelComponent = CustomLabelComponent;

      await render<CountryContext<true>>(<template>
      <PowerSelectMultiple @options={{self.countries}} @labelComponent={{self.labelComponent}} @labelText="Label for select" @onChange={{self.foo}} as |country|>
        {{country.name}}
      </PowerSelectMultiple>
    </template>);

      assert
        .dom('.ember-power-select-custom-label-component')
        .exists('Label is present');

      assert
        .dom('.ember-power-select-custom-label-component')
        .hasText('Label for select');

      assert
        .dom('.ember-power-select-trigger')
        .hasAttribute(
          'id',
          document
            .querySelector('.ember-power-select-custom-label-component')
            ?.getAttribute('for') ?? '',
          'The for from label is matching with id of trigger',
        );
    });
  },
);
