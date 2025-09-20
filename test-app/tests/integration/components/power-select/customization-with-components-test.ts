import { module, test } from 'qunit';
import { setupRenderingTest } from 'test-app/tests/helpers';
import { render, click, focus, type TestContext } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import {
  countries,
  groupedNumbers,
  type Country,
  type GroupedNumber,
  type SelectedCountryExtra,
} from 'test-app/utils/constants';
import { clickTrigger } from 'ember-power-select/test-support/helpers';
import { isPresent } from '@ember/utils';
import type {
  PowerSelectAfterOptionsSignature,
  PowerSelectSelectedItemSignature,
  Select,
  Selected,
} from 'ember-power-select/components/power-select';
import SelectedCountry from 'test-app/components/selected-country';
import type { ComponentLike } from '@glint/template';
import type { PowerSelectTriggerSignature } from 'ember-power-select/components/power-select/trigger';
import CustomTrigger from 'test-app/components/custom-trigger-component';
import SelectedItemCountry from 'test-app/components/selected-item-country';
import ListOfCountries from 'test-app/components/list-of-countries';
import type { PowerSelectOptionsSignature } from 'ember-power-select/components/power-select/options';
import CustomBeforeOptions from 'test-app/components/custom-before-options';
import type { PowerSelectBeforeOptionsSignature } from 'ember-power-select/components/power-select/before-options';
import PowerSelectPlaceholder, {
  type PowerSelectPlaceholderSignature,
} from 'ember-power-select/components/power-select/placeholder';
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

interface CountryContext<IsMultiple extends boolean = false>
  extends TestContext {
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
    PowerSelectPlaceholderSignature<Country, IsMultiple>
  >;
  afterOptionsComponent: ComponentLike<
    PowerSelectAfterOptionsSignature<Country, SelectedCountryExtra, IsMultiple>
  >;
  searchMessageComponent: ComponentLike<
    PowerSelectSearchMessageSignature<Country, IsMultiple>
  >;
  noMatchesMessageComponent: ComponentLike<
    PowerSelectNoMatchesMessageSignature<Country, IsMultiple>
  >;
  labelComponent: ComponentLike<
    PowerSelectLabelSignature<Country, SelectedCountryExtra, IsMultiple>
  >;
  extra?: SelectedCountryExtra;
}

interface GroupedNumbersExtra {
  foo: string;
}

interface GroupedNumbersContext<IsMultiple extends boolean = false>
  extends TestContext {
  foo: (selected: string | null | undefined) => void;
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

    test<CountryContext>('selected option can be customized using triggerComponent', async function (assert) {
      assert.expect(3);

      this.countries = countries;
      this.country = countries[1]; // Spain
      this.triggerComponent = SelectedCountry;

      await render<CountryContext>(hbs`
      <PowerSelect
        @options={{this.countries}}
        @selected={{this.country}}
        @triggerComponent={{this.triggerComponent}}
        @onChange={{fn (mut this.country)}} as |country|>
        {{country.name}}
      </PowerSelect>
    `);

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

    test<CountryContext>('triggerComponent receives loading message', async function (assert) {
      assert.expect(1);
      this.countries = countries;
      this.triggerComponent = CustomTrigger;
      this.foo = () => {};

      await render<CountryContext>(hbs`
      <PowerSelect
        @options={{this.countries}}
        @loadingMessage="hmmmm paella"
        @selected={{this.country}}
        @triggerComponent={{this.triggerComponent}}
        @onChange={{this.foo}} as |country|>
        {{country.name}}
      </PowerSelect>
    `);
      assert
        .dom('.custom-trigger-component')
        .hasText(
          'hmmmm paella',
          'The loading message is passed to the trigger component',
        );
    });

    test<CountryContext>('selected item option can be customized using `@selectedItemComponent`', async function (assert) {
      assert.expect(3);

      this.countries = countries;
      this.country = countries[1]; // Spain
      this.selectedItemComponent = SelectedItemCountry;

      await render<CountryContext>(hbs`
      <PowerSelect
        @options={{this.countries}}
        @selected={{this.country}}
        @selectedItemComponent={{this.selectedItemComponent}}
        @onChange={{fn (mut this.country)}} as |country|>
        {{country.name}}
      </PowerSelect>
    `);

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

    test<CountryContext>('the list of options can be customized using `@optionsComponent`', async function (assert) {
      assert.expect(2);

      this.countries = countries;
      this.country = countries[1]; // Spain
      this.optionsComponent = ListOfCountries;

      await render<CountryContext>(hbs`
      <PowerSelect
        @options={{this.countries}}
        @selected={{this.country}}
        @optionsComponent={{this.optionsComponent}}
        @onChange={{fn (mut this.country)}} as |country|>
        {{country.name}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-options')
        .includesText('Countries:', 'The given component is rendered');
      assert
        .dom('.ember-power-select-options')
        .includesText('3. Russia', 'The component has access to the options');
    });

    test<CountryContext>('the `@optionsComponent` receives the `@extra` hash', async function (assert) {
      assert.expect(2);

      this.countries = countries;
      this.country = countries[1]; // Spain
      this.optionsComponent = ListOfCountries;

      await render<CountryContext>(hbs`
      <PowerSelect
        @options={{this.countries}}
        @selected={{this.country}}
        @optionsComponent={{this.optionsComponent}}
        @onChange={{fn (mut this.country)}}
        @extra={{hash field="code"}} as |country|>
        {{country.code}}
      </PowerSelect>
    `);

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

    test<CountryContext>('the content before the list can be customized passing `@beforeOptionsComponent`', async function (assert) {
      assert.expect(4);

      this.countries = countries;
      this.country = countries[1]; // Spain
      this.beforeOptionsComponent = CustomBeforeOptions;
      this.placeholderComponent = PowerSelectPlaceholder;

      await render<CountryContext>(hbs`
      <PowerSelect
        @selected={{this.country}}
        @beforeOptionsComponent={{this.beforeOptionsComponent}}
        @options={{this.countries}}
        @placeholder="inception"
        @placeholderComponent={{this.placeholderComponent}}
        @onChange={{fn (mut this.country)}} as |country|>
        {{country.name}}
      </PowerSelect>
    `);

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

    test<CountryContext>('the content after the list can be customized passing `@afterOptionsComponent`', async function (assert) {
      assert.expect(2);

      this.countries = countries;
      this.country = countries[1]; // Spain
      this.afterOptionsComponent = CustomAfterOptions;

      await render<CountryContext>(hbs`
      <PowerSelect
        @options={{this.countries}}
        @selected={{this.country}}
        @afterOptionsComponent={{this.afterOptionsComponent}}
        @onChange={{fn (mut this.country)}}
        @searchEnabled={{true}} as |country|>
        {{country.name}}
      </PowerSelect>
    `);

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

    test<CountryContext>('the `@beforeOptionsComponent` and `@afterOptionsComponent` receive the `@extra` hash', async function (assert) {
      assert.expect(1);

      let counter = 0;
      this.countries = countries;
      this.country = countries[1]; // Spain
      this.someAction = function () {
        counter++;
      };
      this.afterOptionsComponent = CustomAfterOptionsTwo;
      this.beforeOptionsComponent = CustomBeforeOptionsTwo;

      await render<CountryContext>(hbs`
      <PowerSelect
        @options={{this.countries}}
        @selected={{this.country}}
        @onChange={{fn (mut this.country)}}
        @afterOptionsComponent={{this.afterOptionsComponent}}
        @beforeOptionsComponent={{this.beforeOptionsComponent}}
        @extra={{hash passedAction=this.someAction}} as |country|>
        {{country.name}}
      </PowerSelect>
    `);

      await clickTrigger();
      await click('.custom-before-options2-button');
      await click('.custom-after-options2-button');
      assert.strictEqual(
        counter,
        2,
        'The action inside the extra hash has been called twice',
      );
    });

    test<CountryContext>('the `@triggerComponent` receives the `@onFocus` action that triggers it', async function (assert) {
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

      await render<CountryContext>(hbs`
      <PowerSelect
        @options={{this.countries}}
        @selected={{this.country}}
        @onChange={{fn (mut this.country)}}
        @triggerComponent={{this.triggerComponent}}
        @onFocus={{this.didFocusInside}} as |country|>
        {{country.name}}
      </PowerSelect>
    `);

      await focus('#focusable-input');
    });

    test<CountryContext>('the search message can be customized passing `@searchMessageComponent`', async function (assert) {
      assert.expect(1);

      this.searchFn = () => [];
      this.foo = () => {};
      this.searchMessageComponent = CustomSearchMessage;
      await render<CountryContext>(hbs`
      <PowerSelect
        @search={{this.searchFn}}
        @searchMessageComponent={{this.searchMessageComponent}}
        @onChange={{this.foo}} as |country|>
        {{country.name}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-dropdown #custom-search-message-p-tag')
        .exists(
          'The custom component is rendered instead of the usual message',
        );
    });

    test<CountryContext>('the no matches element can be customized passing `@noMatchesMessageComponent`', async function (assert) {
      assert.expect(2);

      this.countries = [];
      this.foo = () => {};
      this.noMatchesMessageComponent = CustomNoMatchesMessage;

      await render<CountryContext>(hbs`
      <PowerSelect
        @options={{this.countries}}
        @noMatchesMessageComponent={{this.noMatchesMessageComponent}}
        @noMatchesMessage="Nope"
        @onChange={{this.foo}} as |option|>
        {{option.name}}
      </PowerSelect>
    `);

      await clickTrigger();

      assert
        .dom('.ember-power-select-dropdown #custom-no-matches-message-p-tag')
        .exists(
          'The custom component is rendered instead of the usual message',
        );
      assert.dom('#custom-no-matches-message-p-tag').hasText('Nope');
    });

    test<CountryContext>('placeholder can be customized using `@placeholderComponent`', async function (assert) {
      assert.expect(2);

      this.countries = countries;
      this.foo = () => {};
      this.placeholderComponent = CustomPlaceholder;

      await render<CountryContext>(hbs`
      <PowerSelect
        @options={{this.countries}}
        @placeholder="test"
        @placeholderComponent={{this.placeholderComponent}}
        @onChange={{this.foo}} as |country|>
        {{country.name}}
      </PowerSelect>
    `);

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

    test<GroupedNumbersContext>('`@groupComponent` can be overridden', async function (assert) {
      this.groupedNumbers = groupedNumbers;
      this.foo = () => {};

      const numberOfGroups = 5; // number of groups in groupedNumber;
      this.groupComponent = CustomGroupComponent;

      await render<GroupedNumbersContext>(hbs`
      <PowerSelect
        @options={{this.groupedNumbers}}
        @groupComponent={{component this.groupComponent}}
        @onChange={{this.foo}} as |number|>
        {{number}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-options .custom-component')
        .exists({ count: numberOfGroups });
    });

    test<GroupedNumbersContext>('`@groupComponent` has extension points', async function (assert) {
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

      await render<GroupedNumbersContext>(hbs`
      {{#let (component this.groupComponent onInit=this.onInit) as |groupComponent|}}
        <PowerSelect
          @options={{this.groupedNumbers}}
          @groupComponent={{groupComponent}}
          @extra={{this.extra}}
          @onChange={{this.foo}} as |number|>
          {{number}}
        </PowerSelect>
      {{/let}}
    `);

      await clickTrigger();

      assert
        .dom('.ember-power-select-options .custom-component')
        .exists({ count: numberOfGroups });
    });

    test<CountryContext>('The `@labelComponent` was rendered with text `@labelText="Label for select` and is matching with trigger id', async function (assert) {
      assert.expect(3);

      this.countries = countries;
      this.foo = () => {};
      this.labelComponent = CustomLabelComponent;

      await render<CountryContext>(hbs`
      <PowerSelect
        @options={{this.countries}}
        @labelComponent={{this.labelComponent}}
        @labelText="Label for select"
        @onChange={{this.foo}} as |country|>
        {{country.name}}
      </PowerSelect>
    `);

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
    >('the power-select-multiple placeholder can be customized using `@placeholderComponent`', async function (assert) {
      assert.expect(2);

      this.countries = countries;
      this.foo = () => {};
      this.placeholderComponent = CustomPlaceholder;

      await render<CountryContext<true>>(hbs`
        <PowerSelectMultiple
          @options={{this.countries}}
          @placeholder="test"
          @placeholderComponent={{this.placeholderComponent}}
          @onChange={{this.foo}} as |country|>
          {{country.name}}
        </PowerSelectMultiple>
      `);

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
    >('the power-select-multiple placeholder can be customized using `@placeholderComponent` and work with `@searchEnabled` on `true`', async function (assert) {
      assert.expect(2);

      this.countries = countries;
      this.placeholderComponent = CustomMultipleSearchPlaceholder;

      await render<CountryContext<true>>(hbs`
        <PowerSelectMultiple
          @searchEnabled={{true}}
          @searchField="name"
          @options={{this.countries}}
          @selected={{this.country}}
          @placeholder="test"
          @placeholderComponent={{this.placeholderComponent}}
          @onChange={{fn (mut this.country)}} as |country|>
          {{country.name}}
        </PowerSelectMultiple>
      `);

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
    >('the power-select-multiple `optionsComponent` receives the `extra` hash', async function (assert) {
      assert.expect(2);

      this.countries = countries;
      if (countries[1]) {
        this.country = [countries[1]]; // Spain
      }
      this.optionsComponent = ListOfCountries;

      await render<CountryContext<true>>(hbs`
      <PowerSelectMultiple
        @options={{this.countries}}
        @selected={{this.country}}
        @optionsComponent={{this.optionsComponent}}
        @onChange={{fn (mut this.country)}}
        @extra={{hash field="code"}} as |country|>
        {{country.code}}
      </PowerSelectMultiple>
    `);

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
    >('the power-select-multiple `@triggerComponent` receives the `@extra` hash', async function (assert) {
      assert.expect(1);

      this.countries = countries;
      if (countries[1]) {
        this.country = [countries[1]]; // Spain
      }

      this.triggerComponent = SelectedCountry;

      await render<CountryContext<true>>(hbs`
      <PowerSelectMultiple
        @options={{this.countries}}
        @selected={{this.country}}
        @triggerComponent={{this.triggerComponent}}
        @onChange={{fn (mut this.country)}}
        @extra={{hash coolFlagIcon=true}} as |country|>
        {{country.code}}
      </PowerSelectMultiple>
    `);

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
    >('the power-select-multiple `@selectedItemComponent` receives the `extra` hash', async function (assert) {
      assert.expect(1);

      this.countries = countries;
      if (countries[1]) {
        this.country = [countries[1]]; // Spain
      }

      this.selectedItemComponent = SelectedItemCountry;

      await render<CountryContext<true>>(hbs`
      <div class="select-box">
        <PowerSelectMultiple
            @options={{this.countries}}
            @selected={{this.country}}
            @selectedItemComponent={{this.selectedItemComponent}}
            @onChange={{fn (mut this.country)}}
            @extra={{hash coolFlagIcon=true}} as |country|>
          {{country.code}}
        </PowerSelectMultiple>
      </div>
    `);

      assert
        .dom('.ember-power-select-trigger .cool-flag-icon')
        .exists(
          { count: 1 },
          'The custom selectedItemComponent renders with the extra.coolFlagIcon.',
        );
    });

    test<
      CountryContext<true>
    >('the power-select-multiple content before the list can be customized passing `@beforeOptionsComponent`, search field in trigger', async function (assert) {
      this.countries = countries;
      if (countries[1]) {
        this.country = [countries[1]]; // Spain
      }
      this.beforeOptionsComponent = CustomMultipleBeforeOptions;

      await render<CountryContext<true>>(hbs`
      <div class="select-box">
        <PowerSelectMultiple
            @options={{this.countries}}
            @selected={{this.country}}
            @searchEnabled={{true}}
            @beforeOptionsComponent={{this.beforeOptionsComponent}}
            @placeholder="inception"
            @onChange={{fn (mut this.country)}}
            @extra={{hash coolFlagIcon=true}} as |country|>
          {{country.code}}
        </PowerSelectMultiple>
      </div>
    `);

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
    >('the power-select-multiple content before the list can be customized passing `@beforeOptionsComponent`, search field in before-options', async function (assert) {
      this.countries = countries;
      if (countries[1]) {
        this.country = [countries[1]]; // Spain
      }

      this.beforeOptionsComponent = CustomMultipleBeforeOptions;

      await render<CountryContext<true>>(hbs`
      <div class="select-box">
        <PowerSelectMultiple
            @options={{this.countries}}
            @selected={{this.country}}
            @searchEnabled={{true}}
            @searchFieldPosition="before-options"
            @beforeOptionsComponent={{this.beforeOptionsComponent}}
            @placeholder="inception"
            @onChange={{fn (mut this.country)}}
            @extra={{hash coolFlagIcon=true}} as |country|>
          {{country.code}}
        </PowerSelectMultiple>
      </div>
    `);

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
    >('The power-select-multiple `@labelComponent` was rendered with text `@labelText="Label for select` and is matching with trigger id', async function (assert) {
      assert.expect(3);

      this.countries = countries;
      this.foo = () => {};
      this.labelComponent = CustomLabelComponent;

      await render<CountryContext<true>>(hbs`
      <PowerSelectMultiple
        @options={{this.countries}}
        @labelComponent={{this.labelComponent}}
        @labelText="Label for select"
        @onChange={{this.foo}} as |country|>
        {{country.name}}
      </PowerSelectMultiple>
    `);

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
