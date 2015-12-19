import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { countries } from '../constants';
import { clickTrigger } from '../../../helpers/ember-power-select';

moduleForComponent('ember-power-select', 'Integration | Component | Ember Power Select (Customization using components)', {
  integration: true
});

test('selected option can be customized using selectedComponent', function(assert) {
  assert.expect(2);

  this.countries = countries;
  this.country = countries[1]; // Spain

  this.render(hbs`
    {{#power-select options=countries selected=country selectedComponent="selected-country" onchange=(action (mut foo)) as |country|}}
      {{country.name}}
    {{/power-select}}
  `);

  assert.equal($('.ember-power-select-trigger .icon-flag').length, 1, 'The custom flag appears.');
  assert.equal($('.ember-power-select-trigger').text().trim(), 'Spain', 'With the country name as the text.');
});

test('the list of options can be customized using optionsComponent', function(assert) {
  assert.expect(2);

  this.countries = countries;
  this.country = countries[1]; // Spain

  this.render(hbs`
    {{#power-select options=countries selected=country optionsComponent="list-of-countries" onchange=(action (mut foo)) as |country|}}
      {{country.name}}
    {{/power-select}}
  `);

  clickTrigger();
  let text = $('.ember-power-select-options').text().trim();
  assert.ok(/Countries:/.test(text), 'The given component is rendered');
  assert.ok(/3\. Russia/.test(text), 'The component has access to the options');
});

test('the content before the list can be customized passing `beforeOptionsComponent`', function(assert) {
  assert.expect(2);

  this.countries = countries;
  this.country = countries[1]; // Spain

  this.render(hbs`
    {{#power-select options=countries selected=country beforeOptionsComponent="custom-before-options" onchange=(action (mut foo)) as |country|}}
      {{country.name}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-dropdown #custom-before-options-p-tag').length, 1, 'The custom component is rendered instead of the usual search bar');
  assert.equal($('.ember-power-select-search input').length, 0, 'The search input is not visible');
});

test('the content after the list can be customized passing `afterOptionsComponent`', function(assert) {
  assert.expect(2);

  this.countries = countries;
  this.country = countries[1]; // Spain

  this.render(hbs`
    {{#power-select options=countries selected=country afterOptionsComponent="custom-after-options" onchange=(action (mut foo)) as |country|}}
      {{country.name}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-dropdown #custom-after-options-p-tag').length, 1, 'The custom component is rendered instead of the usual search bar');
  assert.equal($('.ember-power-select-search input').length, 1, 'The search input is still visible');
});