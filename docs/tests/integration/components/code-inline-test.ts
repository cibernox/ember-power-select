import { module, test } from 'qunit';
import { setupRenderingTest } from 'docs/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | code-inline', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(
      hbs`<CodeInline @language="js" @code="console.log('hello');" />`,
    );

    assert.dom().hasText("console.log('hello');");
  });
});
