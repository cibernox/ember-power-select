import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { countries } from '../constants';
import { clickTrigger } from '../../../helpers/ember-power-select';

/**
11 - Customization using components
  c) [NOT DONE] The selected component receives the select's public API and can make use of it
*/

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
