import { isGroup, indexOfOption, optionAtIndex, filterOptions, stripDiacritics, countOptions } from 'ember-power-select/utils/group-utils';
import { module, test } from 'qunit';

const groupedOptions = [
  { groupName: "Smalls", options: ["zero", "one", "two", "three"] },
  { groupName: "Mediums", options: ["four", "five", "six"] },
  { groupName: "Bigs", options: [
      { groupName: "Fairly big", options: ["seven", "eight", "nine"] },
      { groupName: "Really big", options: [ "ten", "eleven", "twelve" ] },
      "thirteen"
    ]
  },
  "one hundred",
  "one thousand"
];
const basicOptions = ['zero', 'one', 'two', 'three', 'four', 'five'];

module('Unit | Utility | Group utils');

test('#isGroup returns true when the given options has `groupName` and `options`', function(assert) {
  assert.ok(!isGroup({}));
  assert.ok(!isGroup({ id: 1, text: 'hello' }));
  assert.ok(!isGroup({ groupName: 1, noOptions: 'hello' }));
  assert.ok(!isGroup({ other: 1, options: ['a', 'b'] }));
  assert.ok(isGroup({ groupName: 1, options: ['a', 'b'] }));
});

test('#indexOfOption returns the index of an option among all', function(assert) {
  assert.equal(indexOfOption(basicOptions, 'zero'), 0);
  assert.equal(indexOfOption(basicOptions, 'five'), 5);
  assert.equal(indexOfOption(basicOptions, 'six'), -1);
  assert.equal(indexOfOption(basicOptions, null), -1);
});

test('#indexOfOption also works transversing groups', function(assert) {
  assert.equal(indexOfOption(groupedOptions, 'zero'), 0);
  assert.equal(indexOfOption(groupedOptions, 'six'), 6);
  assert.equal(indexOfOption(groupedOptions, 'seven'), 7);
  assert.equal(indexOfOption(groupedOptions, 'twelve'), 12);
  assert.equal(indexOfOption(groupedOptions, 'thirteen'), 13);
  assert.equal(indexOfOption(groupedOptions, 'one thousand'), 15);
  assert.equal(indexOfOption(groupedOptions, null), -1);
});

test('#optionAtIndex returns the option in that index is present, null othewise', function(assert) {
  assert.equal(optionAtIndex(basicOptions, 0), 'zero');
  assert.equal(optionAtIndex(basicOptions, 5), 'five');
  assert.equal(optionAtIndex(basicOptions, 7), null);
  assert.equal(optionAtIndex(basicOptions, -1), null); // Should this return the last??
});

test('#optionAtIndex knows how to transverse groups', function(assert) {
  assert.equal(optionAtIndex(groupedOptions, 0), 'zero');
  assert.equal(optionAtIndex(groupedOptions, 6), 'six');
  assert.equal(optionAtIndex(groupedOptions, 7), 'seven');
  assert.equal(optionAtIndex(groupedOptions, 12), 'twelve');
  assert.equal(optionAtIndex(groupedOptions, 13), 'thirteen');
  assert.equal(optionAtIndex(groupedOptions, 15), 'one thousand');
  assert.equal(optionAtIndex(groupedOptions, 16), undefined);
  assert.equal(optionAtIndex(groupedOptions, -1), undefined);
});

test('#filterOptions generates new options respecting groups', function(assert) {
  const matcher = function(value, searchText) {
    return new RegExp(searchText, 'i').test(value);
  };
  assert.deepEqual(filterOptions(groupedOptions, 'zero', matcher), [{ groupName: "Smalls", options: ["zero"] }]);
  assert.deepEqual(filterOptions(groupedOptions, 'ele', matcher), [
    { groupName: "Bigs", options: [
        { groupName: "Really big", options: ["eleven"] },
      ]
    }
  ]);
  assert.deepEqual(filterOptions(groupedOptions, 't', matcher), [
    { groupName: "Smalls", options: ["two","three"] },
    { groupName: "Bigs", options: [
        { groupName: "Fairly big", options: ["eight"] },
        { groupName: "Really big", options: [ "ten", "twelve" ] },
        "thirteen"
      ]
    },
    "one thousand"
  ]);

  assert.deepEqual(filterOptions(groupedOptions, 'imposible', matcher), []);
  assert.deepEqual(filterOptions(groupedOptions, '', matcher), groupedOptions);
});

test('#stripDiacritics returns the given string with diacritics normalized into simple letters', function(assert) {
  assert.equal(stripDiacritics("áãàéèíìóõøòúùñ"), "aaaeeiioooouun");
});

test('#countOptions returns the number of options, transversing the groups with no depth level', function(assert) {
  assert.equal(countOptions(groupedOptions), 16);
});