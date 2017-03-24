import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { countries } from '../constants';
import { clickTrigger } from '../../../helpers/ember-power-select';
import { find, click } from 'ember-native-dom-helpers';

moduleForComponent('ember-power-select', 'Integration | Component | Ember Power Select (Customization using components)', {
  integration: true
});

test('selected option can be customized using triggerComponent', function(assert) {
  assert.expect(3);

  this.countries = countries;
  this.country = countries[1]; // Spain

  this.render(hbs`
    {{#power-select options=countries selected=country triggerComponent="selected-country" onchange=(action (mut foo)) as |country|}}
      {{country.name}}
    {{/power-select}}
  `);

  assert.notOk(find('.ember-power-select-status-icon'), 'The provided trigger component is not rendered');
  assert.ok(find('.ember-power-select-trigger .icon-flag'), 'The custom flag appears.');
  assert.equal(find('.ember-power-select-trigger').textContent.trim(), 'Spain', 'With the country name as the text.');

});

test('selected item option can be customized using selectedItemComponent', function(assert) {
  assert.expect(3);

  this.countries = countries;
  this.country = countries[1]; // Spain

  this.render(hbs`
    {{#power-select options=countries selected=country selectedItemComponent="selected-item-country" onchange=(action (mut foo)) as |country|}}
      {{country.name}}
    {{/power-select}}
  `);

  assert.ok(find('.ember-power-select-status-icon'), 'The provided trigger component is rendered');
  assert.ok(find('.ember-power-select-trigger .icon-flag'), 'The custom flag appears.');
  assert.equal(find('.ember-power-select-trigger').textContent.trim(), 'Spain', 'With the country name as the text.');
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
  let text = find('.ember-power-select-options').textContent.trim();
  assert.ok(/Countries:/.test(text), 'The given component is rendered');
  assert.ok(/3\. Russia/.test(text), 'The component has access to the options');
});

test('the `optionsComponent` receives the `extra` hash', function(assert) {
  assert.expect(2);

  this.countries = countries;
  this.country = countries[1]; // Spain

  this.render(hbs`
    {{#power-select options=countries selected=country optionsComponent="list-of-countries" onchange=(action (mut foo)) extra=(hash field='code') as |country|}}
      {{country.code}}
    {{/power-select}}
  `);

  clickTrigger();
  let text = find('.ember-power-select-options').textContent.trim();
  assert.ok(/Countries:/.test(text), 'The given component is rendered');
  assert.ok(/3\. RU/.test(text), 'The component uses the field in the extra has to render the options');
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
  assert.ok(find('.ember-power-select-dropdown #custom-before-options-p-tag'), 'The custom component is rendered instead of the usual search bar');
  assert.notOk(find('.ember-power-select-search-input'), 'The search input is not visible');
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
  assert.ok(find('.ember-power-select-dropdown #custom-after-options-p-tag'), 'The custom component is rendered instead of the usual search bar');
  assert.ok(find('.ember-power-select-search-input'), 'The search input is still visible');
});

test('the `beforeOptionsComponent` and `afterOptionsComponent` receive the `extra` hash', function(assert) {
  assert.expect(1);
  let counter = 0;
  this.countries = countries;
  this.country = countries[1]; // Spain
  this.someAction = function() {
    counter++;
  };

  this.render(hbs`
    {{#power-select options=countries
      selected=country
      onchange=(action (mut selected))
      afterOptionsComponent="custom-after-options2"
      beforeOptionsComponent="custom-before-options2"
      extra=(hash passedAction=(action someAction)) as |country|}}
      {{country.name}}
    {{/power-select}}
  `);

  clickTrigger();
  click('.custom-before-options2-button');
  click('.custom-after-options2-button');
  assert.equal(counter, 2, 'The action inside the extra hash has been called twice');
});

test('the `triggerComponent` receives the `onFocus` action that triggers the `onfocus` action in the outside', function(assert) {
  assert.expect(10);
  this.countries = countries;
  this.country = countries[1]; // Spain
  this.didFocusInside = function(select, event) {
    assert.equal(typeof select.isOpen, 'boolean', 'select.isOpen is a boolean');
    assert.equal(typeof select.highlighted, 'object', 'select.highlighted is a string');
    assert.equal(typeof select.searchText, 'string', 'select.searchText is a string');
    assert.equal(typeof select.actions.open, 'function', 'select.actions.open is a function');
    assert.equal(typeof select.actions.close, 'function', 'select.actions.close is a function');
    assert.equal(typeof select.actions.reposition, 'function', 'select.actions.reposition is a function');
    assert.equal(typeof select.actions.search, 'function', 'select.actions.search is a function');
    assert.equal(typeof select.actions.highlight, 'function', 'select.actions.highlight is a function');
    assert.equal(typeof select.actions.select, 'function', 'select.actions.select is a function');
    assert.ok(event instanceof window.Event, 'The second argument is an event');
  };
  this.render(hbs`
    {{#power-select options=countries
      selected=country
      onchange=(action (mut selected))
      triggerComponent="custom-trigger-that-handles-focus"
      onfocus=didFocusInside as |country|}}
      {{country.name}}
    {{/power-select}}
  `);

  find('#focusable-input').focus();
});

test('the search message can be customized passing `searchMessageComponent`', function(assert) {
  assert.expect(1);

  this.searchFn = function() {};

  this.render(hbs`
    {{#power-select search=searchFn searchMessageComponent="custom-search-message" onchange=(action (mut foo)) as |country|}}
      {{country.name}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.ok(find('.ember-power-select-dropdown #custom-search-message-p-tag'), 'The custom component is rendered instead of the usual message');
});

test('placeholder can be customized using placeholderComponent', function(assert) {
  assert.expect(2);

  this.countries = countries;

  this.render(hbs`
    {{#power-select
      options=countries
      placeholder="test"
      placeholderComponent="custom-placeholder"
      onchange=(action (mut foo)) as |country|}}
      {{country.name}}
    {{/power-select}}
  `);

  assert.ok(find('.ember-power-select-placeholder'), 'The placeholder appears.');
  assert.equal(
    find('.ember-power-select-placeholder').textContent.trim(),
    'This is a very bold placeholder',
    'The placeholder content is equal.'
   );
});
