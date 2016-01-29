import Ember from 'ember';

export default function updateInputValue(input, oldText, newText) {
  if (!input) { return; }
  if (Ember.isBlank(oldText)) {
    input.value = newText;
  } else {
    let { selectionStart, selectionEnd } = input;
    input.value = newText;
    input.selectionStart = selectionStart;
    input.selectionEnd = selectionEnd;
  }
}
