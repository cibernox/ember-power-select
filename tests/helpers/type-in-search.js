function typeText(selector, text) {
  $(selector).val(text);
  $(selector).trigger('input');
}

export default function typeInSearch(text) {
  typeText('.ember-power-select-search input, .ember-power-select-trigger-multiple-input', text);
}
