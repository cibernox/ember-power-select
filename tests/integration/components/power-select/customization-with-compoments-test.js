import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { countries } from '../constants';
import { clickTrigger } from '../../../helpers/ember-power-select';
import Ember from 'ember';

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

  assert.equal($('.ember-power-select-status-icon').length, 0, 'The provided trigger component is not rendered');
  assert.equal($('.ember-power-select-trigger .icon-flag').length, 1, 'The custom flag appears.');
  assert.equal($('.ember-power-select-trigger').text().trim(), 'Spain', 'With the country name as the text.');

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

  assert.equal($('.ember-power-select-status-icon').length, 1, 'The provided trigger component is rendered');
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
  assert.equal($('.ember-power-select-search-input').length, 0, 'The search input is not visible');
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
  assert.equal($('.ember-power-select-search-input').length, 1, 'The search input is still visible');
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
  Ember.run(() => $('.custom-before-options2-button')[0].click());
  Ember.run(() => $('.custom-after-options2-button')[0].click());
  assert.equal(counter, 2, 'The action inside the extra hash has been called twice');
});

test('the `triggerComponent` receives the `loading` state', function(assert) {
  assert.expect(2);
  this.countries = countries;
  this.country = countries[1]; // Spain
  this.render(hbs`
    {{#power-select options=countries
      selected=country
      onchange=(action (mut selected))
      triggerComponent="custom-trigger-for-loading" as |country|}}
      {{country.name}}
    {{/power-select}}
  `);

  assert.equal(this.$('.ember-power-select-trigger').text().trim(), 'It isn\'t loading', 'Results are not loading');
  let pendingPromise = new Ember.RSVP.Promise(function(resolve) {
    setTimeout(function() {
      resolve(countries);
    }, 100);
  });
  Ember.run(this, 'set', 'countries', pendingPromise);
  assert.equal(this.$('.ember-power-select-trigger').text().trim(), 'Is loading', 'Results are loading');
});

test('the `triggerComponent` receives the `handleFocus` action that triggers the `onfocus` action in the outside', function(assert) {
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

  this.$('#focusable-input')[0].focus();
});