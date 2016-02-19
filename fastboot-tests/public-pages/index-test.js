import { moduleForFastboot } from 'ember-fastboot-test-helpers';

moduleForFastboot('public-pages');

QUnit.test('It renders', function(assert) {
  assert.expect(3);

  return this.visit('/').then(([status, headers, document]) => {
    assert.equal(status, 200, 'Request is successful');
    assert.equal(document.querySelector('.main-page-headline-content').textContent.trim(), 'Powerful and customizable select component for');
    assert.equal(document.querySelectorAll('.selling-point').length, 3);
  });
});
