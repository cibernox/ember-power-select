import Ember from 'ember';

export default Ember.Helper.helper(function([text, termToHighlight]) {
  return Ember.String.htmlSafe(text.replace(new RegExp(termToHighlight, 'i'), '<b>$&</b>')); // Warning. This is not XSS safe!
});
