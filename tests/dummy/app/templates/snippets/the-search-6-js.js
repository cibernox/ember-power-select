export default Ember.Controller.extend({
  names: ['Stefan', 'Miguel', 'Tomster', 'Pluto', 'Robert', 'Alex', 'Lauren', 'Geoffrey', 'Ricardo', 'Jamie'],
});

// helpers/highlight-substr.js
// export default Ember.Helper.helper(function([text, termToHighlight]) {
//   return Ember.String.htmlSafe(text.replace(new RegExp(termToHighlight, 'i'), '<b>$&</b>')); // Warning. This is not XSS safe!
// });
