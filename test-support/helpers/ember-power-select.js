// Helpers for integration tests

function typeText(selector, text) {
  $(selector).val(text);
  $(selector).trigger('input');
}

export function triggerKeydown(domElement, k) {
  var oEvent = document.createEvent("Events");
  oEvent.initEvent('keydown', true, true);
  $.extend(oEvent, {
    view: window,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    keyCode: k,
    charCode: k
  });

  domElement.dispatchEvent(oEvent);
}

export function typeInSearch(text) {
  typeText('.ember-power-select-search input, .ember-power-select-trigger-multiple-input', text);
}

// Helpers for acceptance tests

// TODO