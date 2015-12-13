import Ember from 'ember';

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

export default function() {
  const searchInputSelector = '.ember-power-select-search input, .ember-power-select-trigger-multiple-input';

  Ember.Test.registerAsyncHelper('selectChoose', function(app, cssPath, value) {
    debugger;
    click(`${cssPath} .ember-power-select-trigger`);
    click(`.ember-power-select-option:contains("${value}")`);
  });

  // This is commented because it needs a bit more work.
  // At the moment there is no way to tell if an opened dropdown belongs to a given
  // select. Perhaps each dropdown should have a generated class derived from the unique
  // id of the component.

  // Ember.Test.registerAsyncHelper('selectSearch', function(app, value) {
  //   fillIn(searchInputSelector, value);
  //   if (Ember.VERSION.match(/1\.13/)) {
  //     triggerEvent(searchInputSelector, 'input');
  //   }
  // });
}
