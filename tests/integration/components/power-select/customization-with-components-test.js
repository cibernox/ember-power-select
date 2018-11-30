import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, focus } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { countries } from '../constants';
import { groupedNumbers } from '../constants';
import { clickTrigger } from 'ember-power-select/test-support/helpers';
import { get } from '@ember/object';
import Component from '@ember/component';
import { isPresent } from '@ember/utils';

module('Integration | Component | Ember Power Select (Customization using components)', function(hooks) {
  setupRenderingTest(hooks);

  test('selected option can be customized using triggerComponent', async function(assert) {
    assert.expect(3);

    this.countries = countries;
    this.country = countries[1]; // Spain

    await render(hbs`
      {{#power-select options=countries selected=country triggerComponent="selected-country" onchange=(action (mut foo)) as |country|}}
        {{country.name}}
      {{/power-select}}
    `);

    assert.dom('.ember-power-select-status-icon').doesNotExist('The provided trigger component is not rendered');
    assert.dom('.ember-power-select-trigger .icon-flag').exists('The custom flag appears.');
    assert.dom('.ember-power-select-trigger').hasText('Spain', 'With the country name as the text.');
  });

  test('triggerComponent receives loading message', async function(assert) {
    assert.expect(1);

    this.owner.register('component:custom-trigger-component', Component.extend({
      layout: hbs`<div class="custom-trigger-component">{{loadingMessage}}</div>`
    }));
    await render(hbs`
      {{#power-select loadingMessage="hmmmm paella" selected=country triggerComponent="custom-trigger-component" onchange=(action (mut foo)) as |country|}}
        {{option}}
      {{/power-select}}
    `);
    assert.dom('.custom-trigger-component').hasText('hmmmm paella', 'The loading message is passed to the trigger component');
  });

  test('selected item option can be customized using selectedItemComponent', async function(assert) {
    assert.expect(3);

    this.countries = countries;
    this.country = countries[1]; // Spain

    await render(hbs`
      {{#power-select options=countries selected=country selectedItemComponent="selected-item-country" onchange=(action (mut foo)) as |country|}}
        {{country.name}}
      {{/power-select}}
    `);

    assert.dom('.ember-power-select-status-icon').exists('The provided trigger component is rendered');
    assert.dom('.ember-power-select-trigger .icon-flag').exists('The custom flag appears.');
    assert.dom('.ember-power-select-trigger').hasText('Spain', 'With the country name as the text.');
  });

  test('the list of options can be customized using optionsComponent', async function(assert) {
    assert.expect(2);

    this.countries = countries;
    this.country = countries[1]; // Spain

    await render(hbs`
      {{#power-select options=countries selected=country optionsComponent="list-of-countries" onchange=(action (mut foo)) as |country|}}
        {{country.name}}
      {{/power-select}}
    `);

    await clickTrigger();
    assert.dom('.ember-power-select-options').includesText('Countries:', 'The given component is rendered');
    assert.dom('.ember-power-select-options').includesText('3. Russia', 'The component has access to the options');
  });

  test('the `optionsComponent` receives the `extra` hash', async function(assert) {
    assert.expect(2);

    this.countries = countries;
    this.country = countries[1]; // Spain

    await render(hbs`
      {{#power-select options=countries selected=country optionsComponent="list-of-countries" onchange=(action (mut foo)) extra=(hash field="code") as |country|}}
        {{country.code}}
      {{/power-select}}
    `);

    await clickTrigger();
    assert.dom('.ember-power-select-options').includesText('Countries:', 'The given component is rendered');
    assert.dom('.ember-power-select-options').includesText('3. RU', 'The component uses the field in the extra has to render the options');
  });

  test('the content before the list can be customized passing `beforeOptionsComponent`', async function(assert) {
    assert.expect(4);

    this.countries = countries;
    this.country = countries[1]; // Spain

    await render(hbs`
      {{#power-select
        options=countries
        selected=country
        beforeOptionsComponent="custom-before-options"
        placeholder="inception"
        placeholderComponent=(component "power-select/placeholder")
        onchange=(action (mut foo)) as |country|}}
        {{country.name}}
      {{/power-select}}
    `);

    await clickTrigger();
    assert.dom('.ember-power-select-dropdown #custom-before-options-p-tag').exists('The custom component is rendered instead of the usual search bar');
    assert.dom('.ember-power-select-dropdown #custom-before-options-p-tag').hasText('inception', 'The placeholder attribute is passed through.');
    assert.dom('.ember-power-select-dropdown .ember-power-select-placeholder').exists('The placeholder component is passed through.');
    assert.dom('.ember-power-select-search-input').doesNotExist('The search input is not visible');
  });

  test('the content after the list can be customized passing `afterOptionsComponent`', async function(assert) {
    assert.expect(2);

    this.countries = countries;
    this.country = countries[1]; // Spain

    await render(hbs`
      {{#power-select options=countries selected=country afterOptionsComponent="custom-after-options" onchange=(action (mut foo)) as |country|}}
        {{country.name}}
      {{/power-select}}
    `);

    await clickTrigger();
    assert.dom('.ember-power-select-dropdown #custom-after-options-p-tag').exists('The custom component is rendered instead of the usual search bar');
    assert.dom('.ember-power-select-search-input').exists('The search input is still visible');
  });

  test('the `beforeOptionsComponent` and `afterOptionsComponent` receive the `extra` hash', async function(assert) {
    assert.expect(1);
    let counter = 0;
    this.countries = countries;
    this.country = countries[1]; // Spain
    this.someAction = function() {
      counter++;
    };

    await render(hbs`
      {{#power-select options=countries
        selected=country
        onchange=(action (mut selected))
        afterOptionsComponent="custom-after-options2"
        beforeOptionsComponent="custom-before-options2"
        extra=(hash passedAction=(action someAction)) as |country|}}
        {{country.name}}
      {{/power-select}}
    `);

    await clickTrigger();
    await click('.custom-before-options2-button');
    await click('.custom-after-options2-button');
    assert.equal(counter, 2, 'The action inside the extra hash has been called twice');
  });

  test('the `triggerComponent` receives the `onFocus` action that triggers the `onfocus` action in the outside', async function(assert) {
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
    await render(hbs`
      {{#power-select options=countries
        selected=country
        onchange=(action (mut selected))
        triggerComponent="custom-trigger-that-handles-focus"
        onfocus=didFocusInside as |country|}}
        {{country.name}}
      {{/power-select}}
    `);

    await focus('#focusable-input');
  });

  test('the search message can be customized passing `searchMessageComponent`', async function(assert) {
    assert.expect(1);

    this.searchFn = function() {};

    await render(hbs`
      {{#power-select search=searchFn searchMessageComponent="custom-search-message" onchange=(action (mut foo)) as |country|}}
        {{country.name}}
      {{/power-select}}
    `);

    await clickTrigger();
    assert.dom('.ember-power-select-dropdown #custom-search-message-p-tag').exists('The custom component is rendered instead of the usual message');
  });

  test('placeholder can be customized using placeholderComponent', async function(assert) {
    assert.expect(2);

    this.countries = countries;

    await render(hbs`
      {{#power-select
        options=countries
        placeholder="test"
        placeholderComponent="custom-placeholder"
        onchange=(action (mut foo)) as |country|}}
        {{country.name}}
      {{/power-select}}
    `);

    assert.dom('.ember-power-select-placeholder').exists('The placeholder appears.');
    assert.dom('.ember-power-select-placeholder').hasText('This is a very bold placeholder', 'The placeholder content is equal.');
  });

  test('groupComponent can be overridden', async function(assert) {
    this.groupedNumbers = groupedNumbers;
    let numberOfGroups = 5; // number of groups in groupedNumber;

    let PowerSelectGroupComponent = get(this.owner.factoryFor('component:power-select/power-select-group'), 'class');
    this.owner.register('component:custom-group-component', PowerSelectGroupComponent.extend({
      layout: hbs`<div class="custom-component">{{yield}}</div>`
    }));

    await render(hbs`
      {{#power-select options=groupedNumbers groupComponent="custom-group-component" onchange=(action (mut foo)) as |country|}}
        {{country.name}}
      {{/power-select}}
    `);

    await clickTrigger();
    assert.dom('.ember-power-select-options .custom-component').exists({ count: numberOfGroups });
  });

  test('groupComponent has extension points', async function(assert) {
    this.groupedNumbers = groupedNumbers;
    let numberOfGroups = 5; // number of groups in groupedNumbers
    assert.expect(4 * numberOfGroups + 1);

    let extra = { foo: 'bar' };
    this.extra = extra;
    let PowerSelectGroupComponent = get(this.owner.factoryFor('component:power-select/power-select-group'), 'class');
    assert.ok(PowerSelectGroupComponent, 'component:custom-group-component must be defined');

    this.owner.register('component:custom-group-component', PowerSelectGroupComponent.extend({
      init() {
        this._super(...arguments);
        assert.ok(isPresent(this.get('select')));
        assert.ok(isPresent(this.get('group.groupName')));
        assert.ok(isPresent(this.get('group.options')));
        assert.equal(this.get('extra'), extra);
      }
    }));

    await render(hbs`
      {{#power-select options=groupedNumbers groupComponent="custom-group-component" extra=extra onchange=(action (mut foo)) as |country|}}
        {{country.name}}
      {{/power-select}}
    `);

    await clickTrigger();
  });

  test('the power-select-multiple `optionsComponent` receives the `extra` hash', async function(assert) {
    assert.expect(2);

    this.countries = countries;
    this.country = countries[1]; // Spain

    await render(hbs`
      {{#power-select-multiple options=countries selected=country optionsComponent="list-of-countries" onchange=(action (mut foo)) extra=(hash field="code") as |country|}}
        {{country.code}}
      {{/power-select-multiple}}
    `);

    await clickTrigger();

    assert.dom('.ember-power-select-options').includesText('Countries:', 'The given component is rendered');
    assert.dom('.ember-power-select-options').includesText('3. RU', 'The component uses the field option in the `extra` hash to render the options');
  });

  test('the power-select-multiple `triggerComponent` receives the `extra` hash', async function(assert) {
    assert.expect(1);

    this.countries = countries;
    this.country = countries[1]; // Spain

    await render(hbs`
      {{#power-select-multiple options=countries selected=country triggerComponent="selected-country" onchange=(action (mut foo)) extra=(hash coolFlagIcon=true) as |country|}}
        {{country.code}}
      {{/power-select-multiple}}
    `);

    await clickTrigger();

    assert.dom('.ember-power-select-trigger .cool-flag-icon').exists({ count: 1 }, 'The custom triggerComponent renders with the extra.coolFlagIcon customization option triggering some state change.');
  });

  test('the power-select-multiple `selectedItemComponent` receives the `extra` hash', async function(assert) {
    assert.expect(1);

    this.countries = countries;
    this.country = [countries[1]]; // Spain

    await render(hbs`
      <div class="select-box">
        {{#power-select-multiple
            options=countries
            selected=country
            selectedItemComponent="selected-item-country"
            onchange=(action (mut selected))
            extra=(hash coolFlagIcon=true) as |country|}}
          {{country.code}}
        {{/power-select-multiple}}
      </div>
    `);

    assert.dom('.ember-power-select-trigger .cool-flag-icon').exists({ count: 1 }, 'The custom selectedItemComponent renders with the extra.coolFlagIcon customization option triggering some state change.');
  });
});
