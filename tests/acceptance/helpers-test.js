import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | helpers');

test('selectChoose helper', function(assert) {
  visit('/helpers-testing');

  andThen(function() {
    assert.equal(currentURL(), '/helpers-testing');
    selectChoose('.select-choose', 'three');
  });

  andThen(function() {
    assert.equal(find('.select-choose .ember-power-select-trigger').text().trim(), 'three', 'The proper value has been selected');
    assert.equal($('.ember-power-select-options').length, 0, 'The selectis closed');
    assert.equal(find('.select-choose-target').text().trim(), 'You\'ve selected: three');
  });
});

// test('selectSearch helper', function(assert) {
//   visit('/helpers-testing');

//   andThen(function() {
//     assert.equal(currentURL(), '/helpers-testing');
//     click('.select-async .ember-power-select-trigger');
//     selectSearch('three');
//   });

//   andThen(function() {
//     assert.equal(find('.ember-power-select-options').text().trim(), 'three');
//     selectChoose('.select-async', 'three');
//     // assert.equal(find('.helpers-testing-target .ember-power-select-trigger').text().trim(), 'three', 'The proper value has been selected');
//     // assert.equal($('.ember-power-select-options').length, 0, 'The selectis closed');
//     // assert.equal(find('.selected-target').text().trim(), 'You\'ve selected: three');
//   });
// });
