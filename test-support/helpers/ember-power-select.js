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
  const isEmberOne = Ember.VERSION.match(/1\.13/);

  Ember.Test.registerAsyncHelper('selectChoose', function(app, cssPath, value) {
    const uuid = find(cssPath).find('.ember-power-select-trigger').attr('class').match(/ember-power-select-trigger-(\d+)/)[1]
    // If the dropdown is closed, open it
    if (Ember.$(`.ember-power-select-dropdown-${uuid}`).length === 0) {
      click(`${cssPath} .ember-power-select-trigger`);
    }

    // Select the option with the given text
    click(`.ember-power-select-dropdown-${uuid} .ember-power-select-option:contains("${value}")`);
  });

  Ember.Test.registerAsyncHelper('selectSearch', function(app, cssPath, value) {
    const uuid = find(cssPath).find('.ember-power-select-trigger').attr('class').match(/ember-power-select-trigger-(\d+)/)[1]
    const isMultipleSelect = Ember.$(`${cssPath} .ember-power-select-trigger-multiple-input`).length > 0;

    if (isMultipleSelect) {
      fillIn(`${cssPath} .ember-power-select-trigger-multiple-input`, value);
    } else {
      let dropdownIsClosed = Ember.$(`.ember-power-select-dropdown-${uuid}`).length === 0;
      if (dropdownIsClosed) {
        click(`${cssPath} .ember-power-select-trigger`);
      }
      fillIn('.ember-power-select-search input', value);
    }

    if (isEmberOne) {
      triggerEvent(searchInputSelector, 'input');
    }
  });
}
