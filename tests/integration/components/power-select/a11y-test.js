import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { numbers, groupedNumbers, countriesWithDisabled } from '../constants';
import { triggerKeydown, clickTrigger } from '../../../helpers/ember-power-select';

moduleForComponent('ember-power-select', 'Integration | Component | Ember Power Select (Accesibility)', {
  integration: true
});

test('Single-select: The top-level options list have `role=listbox` and nested lists have `role=group`', function(assert) {
  assert.expect(2);

  this.groupedNumbers = groupedNumbers;
  this.render(hbs`
    {{#power-select options=groupedNumbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  let $rootLevelOptionsList = $('.ember-power-select-dropdown > .ember-power-select-options');
  assert.equal($rootLevelOptionsList.attr('role'), 'listbox', 'The top-level list has `role=listbox`');
  let $nestedOptionList = $('.ember-power-select-options .ember-power-select-options');
  assert.ok($nestedOptionList.toArray().every(l => l.attributes.role.value === 'group'), 'All the nested lists have `role=group`');
});

test('Multiple-select: The top-level options list have `role=listbox` and nested lists have `role=group`', function(assert) {
  assert.expect(2);

  this.groupedNumbers = groupedNumbers;
  this.render(hbs`
    {{#power-select-multiple options=groupedNumbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select-multiple}}
  `);

  clickTrigger();
  let $rootLevelOptionsList = $('.ember-power-select-dropdown > .ember-power-select-options');
  assert.equal($rootLevelOptionsList.attr('role'), 'listbox', 'The top-level list has `role=listbox`');
  let $nestedOptionList = $('.ember-power-select-options .ember-power-select-options');
  assert.ok($nestedOptionList.toArray().every(l => l.attributes.role.value === 'group'), 'All the nested lists have `role=group`');
});

test('Single-select: All options have `role=option`', function(assert) {
  assert.expect(1);

  this.groupedNumbers = groupedNumbers;
  this.render(hbs`
    {{#power-select options=numbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.ok($('.ember-power-select-option').toArray().every(l => l.attributes.role.value === 'option'), 'All the options have `role=option`');
});

test('Multiple-select: All options have `role=option`', function(assert) {
  assert.expect(1);

  this.groupedNumbers = groupedNumbers;
  this.render(hbs`
    {{#power-select options=numbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.ok($('.ember-power-select-option').toArray().every(l => l.attributes.role.value === 'option'), 'All the options have `role=option`');
});

test('Single-select: The selected option has `aria-selected=true` and the rest `aria-selected=false`', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.selected = "two";
  this.render(hbs`
    {{#power-select options=numbers selected=selected onchange=(action (mut selected)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-option:contains("two")').attr('aria-selected'), 'true', 'the selected option has aria-selected=true');
  assert.equal($('.ember-power-select-option[aria-selected="false"]').length, numbers.length - 1, 'All other options have aria-selected=false');
});

test('Multiple-select: The selected options have `aria-selected=true` and the rest `aria-selected=false`', function(assert) {
  assert.expect(3);

  this.numbers = numbers;
  this.selected = ['two', 'four'];
  this.render(hbs`
    {{#power-select-multiple options=numbers selected=selected onchange=(action (mut selected)) as |option|}}
      {{option}}
    {{/power-select-multiple}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-option:contains("two")').attr('aria-selected'), 'true', 'the first selected option has aria-selected=true');
  assert.equal($('.ember-power-select-option:contains("four")').attr('aria-selected'), 'true', 'the second selected option has aria-selected=true');
  assert.equal($('.ember-power-select-option[aria-selected="false"]').length, numbers.length - 2, 'All other options have aria-selected=false');
});

test('Single-select: The highlighted option has `aria-current=true` and the rest `aria-current=false`', function(assert) {
  assert.expect(4);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers selected=selected onchange=(action (mut selected)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-option:contains("one")').attr('aria-current'), 'true', 'the highlighted option has aria-current=true');
  assert.equal($('.ember-power-select-option[aria-current="false"]').length, numbers.length - 1, 'All other options have aria-current=false');
  triggerKeydown($('.ember-power-select-search input')[0], 40);
  assert.equal($('.ember-power-select-option:contains("one")').attr('aria-current'), 'false', 'the first option has now aria-current=false');
  assert.equal($('.ember-power-select-option:contains("two")').attr('aria-current'), 'true', 'the second option has now aria-current=false');
});

test('Multiple-select: The highlighted option has `aria-current=true` and the rest `aria-current=false`', function(assert) {
  assert.expect(4);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers selected=selected onchange=(action (mut selected)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-option:contains("one")').attr('aria-current'), 'true', 'the highlighted option has aria-current=true');
  assert.equal($('.ember-power-select-option[aria-current="false"]').length, numbers.length - 1, 'All other options have aria-current=false');
  triggerKeydown($('.ember-power-select-search input')[0], 40);
  assert.equal($('.ember-power-select-option:contains("one")').attr('aria-current'), 'false', 'the first option has now aria-current=false');
  assert.equal($('.ember-power-select-option:contains("two")').attr('aria-current'), 'true', 'the second option has now aria-current=false');
});

test('Single-select: Options with a disabled field have `aria-disabled=true`', function(assert) {
  assert.expect(1);

  this.countriesWithDisabled = countriesWithDisabled;
  this.render(hbs`
    {{#power-select options=countriesWithDisabled onchange=(action (mut foo)) as |option|}}
      {{option.code}}: {{option.name}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-option[aria-disabled=true]').length, 3, 'Three of them are disabled');
});

test('Multiple-select: Options with a disabled field have `aria-disabled=true`', function(assert) {
  assert.expect(1);

  this.countriesWithDisabled = countriesWithDisabled;
  this.render(hbs`
    {{#power-select-multiple options=countriesWithDisabled onchange=(action (mut foo)) as |option|}}
      {{option.code}}: {{option.name}}
    {{/power-select-multiple}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-option[aria-disabled=true]').length, 3, 'Three of them are disabled');
});

test('Single-select: The trigger has `role=button`, `aria-haspopup=true` and `aria-controls=<id-of-dropdown>`', function(assert) {
  assert.expect(3);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers selected=selected onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal(this.$('.ember-power-select-trigger').attr('role'), 'button', 'The trigger has role button');
  assert.equal(this.$('.ember-power-select-trigger').attr('aria-haspopup'), 'true', 'aria-haspopup is true');
  assert.ok(/^ember-basic-dropdown-content-ember\d+$/.test(this.$('.ember-power-select-trigger').attr('aria-controls')), 'aria-controls point to the dropdown');
});

test('Multiple-select: The trigger has `role=button`, `aria-haspopup=true` and `aria-controls=<id-of-dropdown>`', function(assert) {
  assert.expect(3);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select-multiple options=numbers selected=selected onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select-multiple}}
  `);

  clickTrigger();
  assert.equal(this.$('.ember-power-select-trigger').attr('role'), 'button', 'The trigger has role button');
  assert.equal(this.$('.ember-power-select-trigger').attr('aria-haspopup'), 'true', 'aria-haspopup is true');
  assert.ok(/^ember-basic-dropdown-content-ember\d+$/.test(this.$('.ember-power-select-trigger').attr('aria-controls')), 'aria-controls point to the dropdown');
});

test('Single-select: The trigger attributes `aria-expanded` and `aria-pressed` that are true when the dropdown is opened', function(assert) {
  assert.expect(4);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers selected=selected onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  assert.equal(this.$('.ember-power-select-trigger').attr('aria-expanded'), 'false', 'Not expanded');
  assert.equal(this.$('.ember-power-select-trigger').attr('aria-pressed'), 'false', 'Not pressed');
  clickTrigger();
  assert.equal(this.$('.ember-power-select-trigger').attr('aria-expanded'), 'true', 'Not expanded');
  assert.equal(this.$('.ember-power-select-trigger').attr('aria-pressed'), 'true', 'Not pressed');
});

test('Multiple-select: The trigger attributes `aria-expanded` and `aria-pressed` that are true when the dropdown is opened', function(assert) {
  assert.expect(4);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select-multiple options=numbers selected=selected onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select-multiple}}
  `);

  assert.equal(this.$('.ember-power-select-trigger').attr('aria-expanded'), 'false', 'Not expanded');
  assert.equal(this.$('.ember-power-select-trigger').attr('aria-pressed'), 'false', 'Not pressed');
  clickTrigger();
  assert.equal(this.$('.ember-power-select-trigger').attr('aria-expanded'), 'true', 'Not expanded');
  assert.equal(this.$('.ember-power-select-trigger').attr('aria-pressed'), 'true', 'Not pressed');
});

test('Single-select: The listbox has a unique id`', function(assert) {
  assert.expect(1);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers selected=selected onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.ok(/^ember-power-select-options-ember\d+$/.test($('.ember-power-select-options').attr('id')), 'The search has a unique id');
});

test('Multiple-select: The listbox has a unique id`', function(assert) {
  assert.expect(1);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select-multiple options=numbers selected=selected onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select-multiple}}
  `);

  clickTrigger();
  assert.ok(/^ember-power-select-options-ember\d+$/.test($('.ember-power-select-options').attr('id')), 'The search has a unique id');
});

test('Single-select: The searchbox has type `search` and `aria-controls=<id-of-listbox>`', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers selected=selected onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-search input').attr('type'), 'search', 'The type of the input is `search`');
  assert.ok(/^ember-power-select-options-ember\d+$/.test($('.ember-power-select-search input').attr('aria-controls')), 'The `aria-controls` points to the id of the listbox');
});

test('Multiple-select: The searchbox has type `search` and `aria-controls=<id-of-listbox>`', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select-multiple options=numbers selected=selected onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select-multiple}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-trigger-multiple-input').attr('type'), 'search', 'The type of the input is `search`');
  assert.ok(/^ember-power-select-options-ember\d+$/.test($('.ember-power-select-trigger-multiple-input').attr('aria-controls')), 'The `aria-controls` points to the id of the listbox');
});

test('Single-select: The listbox has `aria-controls=<id-of-the-trigger>`', function(assert) {
  assert.expect(1);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers selected=selected onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.ok(/^ember-power-select-trigger-ember\d+$/.test($('.ember-power-select-options').attr('aria-controls')), 'The listbox controls the trigger');
});

test('Multiple-select: The listbox has `aria-controls=<id-of-the-trigger>`', function(assert) {
  assert.expect(1);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select-multiple options=numbers selected=selected onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select-multiple}}
  `);

  clickTrigger();
  assert.ok(/^ember-power-select-trigger-ember\d+$/.test($('.ember-power-select-options').attr('aria-controls')), 'The listbox controls the trigger');
});

test('Multiple-select: The selected elements are <li>s inside an <ul>, and have an item with `role=button` with `aria-label="remove element"`', function(assert) {
  assert.expect(12);

  this.numbers = numbers;
  this.selected = ['two', 'four', 'six'];
  this.render(hbs`
    {{#power-select-multiple options=numbers selected=selected onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select-multiple}}
  `);

  this.$('.ember-power-select-multiple-option').toArray().forEach(function(e) {
    assert.equal(e.tagName, 'LI', 'The element is a list item');
    assert.equal(e.parentElement.tagName, 'UL', 'The parent element is a list');
    let closeButton = e.querySelector('.ember-power-select-multiple-remove-btn');
    assert.equal($(closeButton).attr('role'), 'button', 'The role of the close button is "button"');
    assert.equal($(closeButton).attr('aria-label'), 'remove element', 'The close button has a helpful aria label');
  });
});

test('Single-select: The trigger element correctly passes through WAI-ARIA widget attributes', function(assert) {
  assert.expect(3);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select
      ariaInvalid=true
      ariaLabel='ariaLabelString'
      onchange=(action (mut foo))
      options=numbers
      required=true
      selected=selected
      as |option|
    }}
      {{option}}
    {{/power-select}}
  `);
  const $trigger = this.$('.ember-power-select-trigger');

  assert.equal($trigger.attr('aria-label'), 'ariaLabelString', 'aria-label set correctly');
  assert.equal($trigger.attr('aria-invalid'), 'true', 'aria-invalid set correctly');
  assert.equal($trigger.attr('aria-required'), 'true', 'aria-required set correctly');
});

test('Multiple-select: The trigger element correctly passes through WAI-ARIA widget attributes', function(assert) {
  assert.expect(3);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select-multiple
      ariaLabel='ariaLabelString'
      ariaInvalid=true
      onchange=(action (mut foo))
      options=numbers
      required=true
      selected=selected
      as |option|
    }}
      {{option}}
    {{/power-select-multiple}}
  `);
  const $trigger = this.$('.ember-power-select-trigger');

  assert.equal($trigger.attr('aria-label'), 'ariaLabelString', 'aria-label set correctly');
  assert.equal($trigger.attr('aria-invalid'), 'true', 'aria-invalid set correctly');
  assert.equal($trigger.attr('aria-required'), 'true', 'aria-required set correctly');
});

test('Single-select: The trigger element correctly passes through WAI-ARIA relationship attributes', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select
      ariaDescribedBy='ariaDescribedByString'
      ariaLabelledBy='ariaLabelledByString'
      onchange=(action (mut foo))
      options=numbers
      selected=selected
      as |option|
    }}
      {{option}}
    {{/power-select}}
  `);
  const $trigger = this.$('.ember-power-select-trigger');

  assert.equal($trigger.attr('aria-describedby'), 'ariaDescribedByString', 'aria-describedby set correctly');
  assert.equal($trigger.attr('aria-labelledby'), 'ariaLabelledByString', 'aria-required set correctly');
});

test('Multiple-select: The trigger element correctly passes through WAI-ARIA relationship attributes', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select-multiple
      ariaDescribedBy='ariaDescribedByString'
      ariaLabelledBy='ariaLabelledByString'
      onchange=(action (mut foo))
      options=numbers
      selected=selected
      as |option|
    }}
      {{option}}
    {{/power-select-multiple}}
  `);
  const $trigger = this.$('.ember-power-select-trigger');

  assert.equal($trigger.attr('aria-describedby'), 'ariaDescribedByString', 'aria-describedby set correctly');
  assert.equal($trigger.attr('aria-labelledby'), 'ariaLabelledByString', 'aria-required set correctly');
});
