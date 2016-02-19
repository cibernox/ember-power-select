import { moduleForFastboot } from 'ember-fastboot-test-helpers';

moduleForFastboot('addons.index');

QUnit.test('It renders', function(assert) {
  assert.expect(2);

  return this.visit('/addons').then(([status, headers, document]) => {
    assert.equal(status, 200, 'Request is successful');
    assert.equal(document.querySelector('.doc-page-title').textContent.trim(), 'Addons');
  });
});
