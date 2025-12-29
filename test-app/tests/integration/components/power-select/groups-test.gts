import { module, test } from 'qunit';
import { setupRenderingTest } from 'test-app/tests/helpers';
import { render, click } from '@ember/test-helpers';
import {
  typeInSearch,
  clickTrigger,
} from 'ember-power-select/test-support/helpers';
import {
  groupedNumbers,
  groupedNumbersWithCustomProperty,
  type GroupedNumbersWithCustomProperty,
} from 'test-app/utils/constants';
import type { TestContext } from '@ember/test-helpers';
import type { Selected } from 'ember-power-select/types';
import CustomGroupComponentWithVariant from 'test-app/components/custom-group-component-with-variant';
import type { ComponentLike } from '@glint/template';
import type { PowerSelectPowerSelectGroupSignature } from 'ember-power-select/components/power-select/power-select-group';
import PowerSelect from 'ember-power-select/components/power-select';
import PowerSelectMultiple from 'ember-power-select/components/power-select-multiple';
import { fn } from '@ember/helper';

interface GroupedNumbersContext extends TestContext {
  foo: (selected: string | undefined) => void;
  groupedNumbers: typeof groupedNumbers;
  selected: Selected<string>;
}

interface GroupedNumbersWithCustomPropertyContext<
  IsMultiple extends boolean = false,
> extends TestContext {
  foo: (selected: Selected<string, IsMultiple>) => void;
  groupedNumbersWithCustomProperty: GroupedNumbersWithCustomProperty[];
  // extra?: GroupedNumbersExtra;
  // onInit?: () => void;
  groupComponent: ComponentLike<
    PowerSelectPowerSelectGroupSignature<
      GroupedNumbersWithCustomProperty,
      unknown,
      IsMultiple
    >
  >;
}

interface NotQuiteGroups {
  groupName: string;
  initial: string;
}

interface NotQuiteGroupsContext extends TestContext {
  foo: (selected: Selected<NotQuiteGroups>) => void;
  notQuiteGroups: NotQuiteGroups[];
}

module(
  'Integration | Component | Ember Power Select (Groups)',
  function (hooks) {
    setupRenderingTest(hooks);

    test<GroupedNumbersContext>('Options that have a `groupName` and `options` are considered groups and are rendered as such', async function (assert) {
      const self = this;

      assert.expect(10);

      this.groupedNumbers = groupedNumbers;
      this.foo = () => {};
      await render<GroupedNumbersContext>(
        <template>
          <PowerSelect
            @options={{self.groupedNumbers}}
            @onChange={{self.foo}}
            as |option|
          >
            {{option}}
          </PowerSelect>
        </template>,
      );

      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist('Dropdown is not rendered');

      await clickTrigger();

      const rootLevelGroups = document.querySelectorAll(
        '.ember-power-select-dropdown > .ember-power-select-options > .ember-power-select-group',
      ) as unknown as HTMLElement[];
      const rootLevelOptions = document.querySelectorAll(
        '.ember-power-select-dropdown > .ember-power-select-options > .ember-power-select-option',
      ) as unknown as HTMLElement[];
      assert
        .dom(
          '.ember-power-select-dropdown > .ember-power-select-options > .ember-power-select-group',
        )
        .exists({ count: 3 }, 'There is 3 groups in the root level');
      assert
        .dom(
          '.ember-power-select-dropdown > .ember-power-select-options > .ember-power-select-option',
        )
        .exists({ count: 2 }, 'There is 2 options in the root level');
      assert
        .dom('.ember-power-select-group-name', rootLevelGroups[0])
        .hasText('Smalls');
      assert
        .dom('.ember-power-select-group-name', rootLevelGroups[1])
        .hasText('Mediums');
      assert
        .dom('.ember-power-select-group-name', rootLevelGroups[2])
        .hasText('Bigs');
      assert.dom(rootLevelOptions[0]).hasText('one hundred');
      assert.dom(rootLevelOptions[1]).hasText('one thousand');
      const bigs: HTMLElement = [].slice
        .apply(rootLevelGroups[2]?.children)
        .filter((e: HTMLElement) =>
          e.classList.contains('ember-power-select-options'),
        )[0]!;
      const bigGroups = [].slice
        .apply(bigs.children)
        .filter((e: HTMLElement) =>
          e.classList.contains('ember-power-select-group'),
        );
      const bigOptions = [].slice
        .apply(bigs.children)
        .filter((e: HTMLElement) =>
          e.classList.contains('ember-power-select-option'),
        );
      assert.strictEqual(
        bigGroups.length,
        2,
        'There is 2 sub-groups in the "bigs" group',
      );
      assert.strictEqual(
        bigOptions.length,
        1,
        'There is 1 option in the "bigs" group',
      );
    });

    test<NotQuiteGroupsContext>('Options that have a `groupName` but NOT `options` are NOT considered groups and are rendered normally', async function (assert) {
      const self = this;

      assert.expect(3);

      this.notQuiteGroups = [
        { groupName: 'Lions', initial: 'L' },
        { groupName: 'Tigers', initial: 'T' },
        { groupName: 'Dogs', initial: 'D' },
        { groupName: 'Eagles', initial: 'E' },
      ];
      this.foo = () => {};

      await render<NotQuiteGroupsContext>(
        <template>
          <PowerSelect
            @options={{self.notQuiteGroups}}
            @onChange={{self.foo}}
            as |option|
          >
            {{option.groupName}}
          </PowerSelect>
        </template>,
      );

      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist('Dropdown is not rendered');
      await clickTrigger();
      assert.dom('.ember-power-select-option').exists({ count: 4 });
      assert.dom('.ember-power-select-option:nth-child(2)').hasText('Tigers');
    });

    test<GroupedNumbersContext>("When filtering, a group title is visible as long as one of it's elements is", async function (assert) {
      const self = this;

      assert.expect(3);

      this.groupedNumbers = groupedNumbers;
      this.foo = () => {};

      await render<GroupedNumbersContext>(
        <template>
          <PowerSelect
            @options={{self.groupedNumbers}}
            @onChange={{self.foo}}
            @searchEnabled={{true}}
            as |option|
          >
            {{option}}
          </PowerSelect>
        </template>,
      );
      await clickTrigger();
      await typeInSearch('ve');
      let groupNames = Array.from(
        document.querySelectorAll('.ember-power-select-group-name'),
      ).map((e) => e.textContent?.trim());
      const optionValues = Array.from(
        document.querySelectorAll('.ember-power-select-option'),
      ).map((e) => e.textContent?.trim());
      assert.deepEqual(
        groupNames,
        ['Mediums', 'Bigs', 'Fairly big', 'Really big'],
        'Only the groups with matching options are shown',
      );
      assert.deepEqual(
        optionValues,
        ['five', 'seven', 'eleven', 'twelve'],
        'Only the matching options are shown',
      );
      await typeInSearch('lve');
      groupNames = Array.from(
        document.querySelectorAll('.ember-power-select-group-name'),
      ).map((e) => e.textContent?.trim());
      assert.deepEqual(
        groupNames,
        ['Bigs', 'Really big'],
        'With no depth level',
      );
    });

    test<GroupedNumbersWithCustomPropertyContext>('When filtering, all properties of the options remain available for a single select', async function (assert) {
      const self = this;

      this.groupedNumbersWithCustomProperty = groupedNumbersWithCustomProperty;
      this.foo = () => {};

      this.groupComponent = CustomGroupComponentWithVariant;

      await render<GroupedNumbersWithCustomPropertyContext>(
        <template>
          <PowerSelect
            @options={{self.groupedNumbersWithCustomProperty}}
            @onChange={{self.foo}}
            @searchEnabled={{true}}
            @groupComponent={{self.groupComponent}}
            as |option|
          >
            {{option}}
          </PowerSelect>
        </template>,
      );

      await clickTrigger();

      const variants = Array.from(
        document.querySelectorAll('[data-test-id="group-component-variant"]'),
      ).map((e) => e.textContent?.trim());

      assert.deepEqual(variants, [
        'Primary',
        'Secondary',
        'Primary',
        'Secondary',
        'Primary',
      ]);

      await typeInSearch('one');

      assert
        .dom('[data-test-id="group-component-variant"]')
        .exists({ count: 1 });

      assert.dom('[data-test-id="group-component-variant"]').hasText('Primary');
    });

    test<
      GroupedNumbersWithCustomPropertyContext<true>
    >('When filtering, all properties of the options remain available for a multi select', async function (assert) {
      const self = this;

      this.groupedNumbersWithCustomProperty = groupedNumbersWithCustomProperty;

      this.foo = () => {};

      this.groupComponent = CustomGroupComponentWithVariant;

      await render<GroupedNumbersWithCustomPropertyContext<true>>(
        <template>
          <PowerSelectMultiple
            @options={{self.groupedNumbersWithCustomProperty}}
            @onChange={{self.foo}}
            @searchEnabled={{true}}
            @groupComponent={{self.groupComponent}}
            as |option|
          >
            {{option}}
          </PowerSelectMultiple>
        </template>,
      );

      await clickTrigger();

      const variants = Array.from(
        document.querySelectorAll('[data-test-id="group-component-variant"]'),
      ).map((e) => e.textContent?.trim());

      assert.deepEqual(variants, [
        'Primary',
        'Secondary',
        'Primary',
        'Secondary',
        'Primary',
      ]);

      await typeInSearch('one');

      assert
        .dom('[data-test-id="group-component-variant"]')
        .exists({ count: 1 });

      assert.dom('[data-test-id="group-component-variant"]').hasText('Primary');
    });

    test<GroupedNumbersContext>('Click on an option of a group select selects the option and closes the dropdown', async function (assert) {
      const self = this;

      assert.expect(2);

      this.groupedNumbers = groupedNumbers;
      await render<GroupedNumbersContext>(
        <template>
          <PowerSelect
            @options={{self.groupedNumbers}}
            @selected={{self.selected}}
            @onChange={{fn (mut self.selected)}}
            as |option|
          >
            {{option}}
          </PowerSelect>
        </template>,
      );
      await clickTrigger();
      const option = Array.from(
        document.querySelectorAll('.ember-power-select-option'),
      ).find((e) => (e.textContent?.indexOf('four') ?? -1) > -1);
      if (option) {
        await click(option);
      }
      assert
        .dom('.ember-power-select-trigger')
        .hasText('four', 'The clicked option was selected');
      assert
        .dom('.ember-power-select-options')
        .doesNotExist('The dropdown has dissapeared');
    });

    test<GroupedNumbersContext>("Clicking on the title of a group doesn't performs any action nor closes the dropdown", async function (assert) {
      const self = this;

      assert.expect(1);

      this.groupedNumbers = groupedNumbers;
      this.foo = () => {};
      await render<GroupedNumbersContext>(
        <template>
          <PowerSelect
            @options={{self.groupedNumbers}}
            @onChange={{self.foo}}
            as |option|
          >
            {{option}}
          </PowerSelect>
        </template>,
      );

      await clickTrigger();
      const selectedGroup = document.querySelectorAll(
        '.ember-power-select-group-name',
      )[1];
      if (selectedGroup) {
        await click(selectedGroup);
      }

      assert
        .dom('.ember-power-select-dropdown')
        .exists('The select is still opened');
    });
  },
);
