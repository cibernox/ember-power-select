import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { countries } from '../constants';
import { find } from 'ember-native-dom-helpers';

module('Integration | Component | Ember Power Select (Customization using attrs)', function(hooks) {
  setupRenderingTest(hooks);

  test('classNames can be propagated to the child basic-dropdown component', async function(assert) {
    assert.expect(1);

    this.countries = countries;
    this.country = countries[1]; // Spain

    await render(hbs`
      {{#power-select renderInPlace=true classNames="ember-power-select" options=countries selected=country onchange=(action (mut foo)) as |country|}}
        {{country.name}}
      {{/power-select}}
    `);

    assert.ok(find('.ember-basic-dropdown.ember-power-select'), 'Class was added.');
  });

  test('trigger on single selects can be customized using triggerClass', async function(assert) {
    assert.expect(1);

    this.countries = countries;
    this.country = countries[1]; // Spain

    await render(hbs`
      {{#power-select options=countries selected=country onchange=(action (mut foo)) triggerClass="country-single-trigger" as |country|}}
        {{country.name}}
      {{/power-select}}
    `);

    assert.ok(find('.country-single-trigger'), 'Class was added.');
  });

  test('trigger on multiple selects can be customized using triggerClass', async function(assert) {
    assert.expect(1);

    this.countries = countries;
    this.country = [countries[1], countries[0]];

    await render(hbs`
      {{#power-select options=countries selected=country onchange=(action (mut foo)) triggerClass="country-multiple-trigger" as |country|}}
        {{country.name}}
      {{/power-select}}
    `);

    assert.ok(find('.country-multiple-trigger'), 'Class was added.');
  });

  test('Trigger can have a custom id passing triggerId', async function(assert) {
    assert.expect(1);

    this.countries = countries;
    this.country = [countries[1], countries[0]];

    await render(hbs`
      {{#power-select options=countries selected=country onchange=(action (mut foo)) triggerId="this-is-my-id" as |country|}}
        {{country.name}}
      {{/power-select}}
    `);

    assert.equal(find('.ember-power-select-trigger').id, 'this-is-my-id', 'The `id` was added.');
  });

  test('Trigger can have a custom id passing triggerId', async function(assert) {
    assert.expect(1);

    this.countries = countries;
    this.country = [countries[1], countries[0]];

    await render(hbs`
      {{#power-select-multiple options=countries selected=country onchange=(action (mut foo)) triggerId="this-is-my-id" as |country|}}
        {{country.name}}
      {{/power-select-multiple}}
    `);

    assert.equal(find('.ember-power-select-trigger').id, 'this-is-my-id', 'The `id` was added.');
  });
});
