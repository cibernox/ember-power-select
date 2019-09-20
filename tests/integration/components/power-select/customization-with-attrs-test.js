import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { countries } from '../constants';

module('Integration | Component | Ember Power Select (Customization using attrs)', function(hooks) {
  setupRenderingTest(hooks);

  test('the `class` attribute is forwarded to the wrapper element', async function(assert) {
    assert.expect(1);

    this.countries = countries;
    this.country = countries[1]; // Spain

    await render(hbs`
      <PowerSelect @renderInPlace={{true}} class="foo" @options={{countries}} @selected={{country}} @onChange={{action (mut foo)}} as |country|>
        {{country.name}}
      </PowerSelect>
    `);

    assert.dom('.ember-basic-dropdown').hasClass('foo', 'Class was added.');
  });

  test('trigger on single selects can be customized using triggerClass', async function(assert) {
    assert.expect(1);

    this.countries = countries;
    this.country = countries[1]; // Spain

    await render(hbs`
      <PowerSelect @options={{countries}} @selected={{country}} @onChange={{action (mut foo)}} @triggerClass="country-single-trigger" as |country|>
        {{country.name}}
      </PowerSelect>
    `);

    assert.dom('.ember-power-select-trigger').hasClass('country-single-trigger', 'Class was added.');
  });

  test('trigger on multiple selects can be customized using @triggerClass', async function(assert) {
    assert.expect(1);

    this.countries = countries;
    this.country = [countries[1], countries[0]];

    await render(hbs`
      <PowerSelect @options={{countries}} @selected={{country}} @onChange={{action (mut foo)}} @triggerClass="country-multiple-trigger" as |country|>
        {{country.name}}
      </PowerSelect>
    `);

    assert.dom('.ember-power-select-trigger').hasClass('country-multiple-trigger', 'Class was added.');
  });

  test('Trigger can have a custom id passing @triggerId', async function(assert) {
    assert.expect(1);

    this.countries = countries;
    this.country = [countries[1], countries[0]];

    await render(hbs`
      <PowerSelect @options=countries @selected={{country}} @onChange={{action (mut foo)}} @triggerId="this-is-my-id" as |country|>
        {{country.name}}
      </PowerSelect>
    `);

    assert.dom('.ember-power-select-trigger').hasAttribute('id', 'this-is-my-id', 'The `id` was added.');
  });

  test('Trigger can have a custom id passing @triggerId (multiple select)', async function(assert) {
    assert.expect(1);

    this.countries = countries;
    this.country = [countries[1], countries[0]];

    await render(hbs`
      <PowerSelectMultiple @options={{countries}} @selected={{country}} @onChange={{action (mut foo)}} @triggerId="this-is-my-id" as |country|>
        {{country.name}}
      </PowerSelectMultiple>
    `);

    assert.dom('.ember-power-select-trigger').hasAttribute('id', 'this-is-my-id', 'The `id` was added.');
  });
});
