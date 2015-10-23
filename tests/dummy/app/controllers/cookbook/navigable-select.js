import Ember from 'ember';

const groupedNumbers = [
  { groupName: "Smalls", options: ["one", "two", "three"] },
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

export default Ember.Controller.extend({
  groupedNumbers: groupedNumbers,
  selectedNumber: null,
  tabsNoExample: ['template', 'javascript']
});