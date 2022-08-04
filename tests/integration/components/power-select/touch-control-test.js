import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, tap, triggerEvent } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { numbers } from '../constants';

module(
  'Integration | Component | Ember Power Select (Touch control)',
  function (hooks) {
    setupRenderingTest(hooks);

    test('Touch on trigger should open the dropdown', async function (assert) {
      assert.expect(1);

      this.numbers = numbers;
      await render(hbs`
      <PowerSelect @options={{this.numbers}} @onChange={{action (mut this.foo)}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await tap('.ember-power-select-trigger');
      assert.dom('.ember-power-select-options').exists('The dropdown is shown');
    });

    test('Touch on option should select it', async function (assert) {
      assert.expect(1);

      this.numbers = numbers;
      await render(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.foo}} @onChange={{action (mut this.foo)}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await tap('.ember-power-select-trigger');
      await tap(document.querySelectorAll('.ember-power-select-option')[3]);
      assert.dom('.ember-power-select-selected-item').hasText('four');
    });

    test('Touch on custom option should select it', async function (assert) {
      assert.expect(1);

      this.numbers = numbers;
      await render(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.foo}} @onChange={{action (mut this.foo)}} as |option|>
        <div class="super-fancy">{{option}}</div>
      </PowerSelect>
    `);

      await tap('.ember-power-select-trigger');
      await tap(document.querySelectorAll('.super-fancy')[3]);
      assert.dom('.ember-power-select-selected-item').hasText('four');
    });

    test('Touch on clear button should deselect it', async function (assert) {
      assert.expect(1);

      this.numbers = numbers;
      this.foo = 'one';
      await render(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.foo}} @allowClear={{true}} @onChange={{action (mut this.foo)}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await tap('.ember-power-select-clear-btn');
      assert.dom('.ember-power-select-selected-item').doesNotExist();
    });

    test('Scrolling (touchstart + touchmove + touchend) should not select the option', async function (assert) {
      assert.expect(1);

      this.numbers = numbers;
      await render(hbs`
        <PowerSelect @options={{this.numbers}} @selected={{this.foo}} @extra={{hash _isTouchDevice=true}} @onChange={{action (mut this.foo)}} as |option|>
          {{option}}
        </PowerSelect>
      `);

      await tap('.ember-power-select-trigger');
      let option = document.querySelectorAll('.ember-power-select-option')[3];
      await triggerEvent(option, 'touchstart');
      await triggerEvent(option, 'touchmove', {
        changedTouches: [{ touchType: 'direct', pageX: 0, pageY: 0 }],
      });
      await triggerEvent(option, 'touchend', {
        changedTouches: [{ touchType: 'direct', pageX: 0, pageY: 10 }],
      });
      assert.dom('.ember-power-select-selected-item').doesNotExist();
    });

    test('Using stylus on touch device should select the option', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      await render(hbs`
        <PowerSelect @options={{this.numbers}} @selected={{this.foo}} @extra={{hash _isTouchDevice=true}} @onChange={{action (mut this.foo)}} as |option|>
          {{option}}
        </PowerSelect>
      `);

      await tap('.ember-power-select-trigger');
      let option = document.querySelectorAll('.ember-power-select-option')[3];

      // scroll
      await triggerEvent(option, 'touchstart');
      await triggerEvent(option, 'touchmove', {
        changedTouches: [{ touchType: 'stylus', pageX: 0, pageY: 0 }],
      });
      await triggerEvent(option, 'touchend', {
        changedTouches: [{ touchType: 'stylus', pageX: 0, pageY: 10 }],
      });
      assert.dom('.ember-power-select-selected-item').doesNotExist();

      // tap
      await triggerEvent(option, 'touchstart');
      await triggerEvent(option, 'touchmove', {
        changedTouches: [{ touchType: 'stylus', pageX: 0, pageY: 0 }],
      });
      await triggerEvent(option, 'touchend', {
        changedTouches: [{ touchType: 'stylus', pageX: 4, pageY: 0 }],
      });
      assert.dom('.ember-power-select-selected-item').hasText('four');
    });
  }
);
