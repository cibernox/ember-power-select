import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('power-select-multiple/selected', 'Integration | Component | power select multiple/selected', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{power-select-multiple/selected}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#power-select-multiple/selected}}
      template block text
    {{/power-select-multiple/selected}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
