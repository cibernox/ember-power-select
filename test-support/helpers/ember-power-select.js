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
  Ember.run(() => {
    domElement.dispatchEvent(oEvent);
  });
}

export function typeInSearch(text) {
  Ember.run(() => {
    typeText('.ember-power-select-search input, .ember-power-select-trigger-multiple-input', text);
  });
}

export function clickTrigger(scope, options = {}) {
  let selector = '.ember-power-select-trigger';
  if (scope) {
    selector = scope + ' ' + selector;
  }
  let event = new window.MouseEvent('mousedown', Object.assign({ bubbles: true, cancelable: true, view: window }, options));
  Ember.run(() => Ember.$(selector)[0].dispatchEvent(event));
}

// Helpers for acceptance tests

export default function() {
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

    let dropdownIsClosed = Ember.$(`.ember-power-select-dropdown-${uuid}`).length === 0;
    if (dropdownIsClosed) {
      click(`${cssPath} .ember-power-select-trigger`);
    }

    if (isMultipleSelect) {
      fillIn(`${cssPath} .ember-power-select-trigger-multiple-input`, value);
      if (isEmberOne) {
        triggerEvent(`${cssPath} .ember-power-select-trigger-multiple-input`, 'input');
      }
    } else {
      fillIn('.ember-power-select-search input', value);
      if (isEmberOne) {
        triggerEvent(`.ember-power-select-dropdown-${uuid} .ember-power-select-search input`, 'input');
      }
    }

  });
}
