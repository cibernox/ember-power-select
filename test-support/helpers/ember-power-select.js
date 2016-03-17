import Ember from 'ember';

// Helpers for integration tests

function typeText(selector, text) {
  $(selector).val(text);
  $(selector).trigger('input');
}

export function nativeMouseDown(selector, options = {}) {
  let event = new window.Event('mousedown', { bubbles: true, cancelable: true, view: window });
  Object.keys(options).forEach(key => event[key] = options[key]);
  Ember.run(() => Ember.$(selector)[0].dispatchEvent(event));
}

export function nativeMouseUp(selector, options = {}) {
  let event = new window.Event('mouseup', { bubbles: true, cancelable: true, view: window });
  Object.keys(options).forEach(key => event[key] = options[key]);
  Ember.run(() => Ember.$(selector)[0].dispatchEvent(event));
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
  nativeMouseDown(selector, options);
}

// Helpers for acceptance tests

export default function() {
  const isEmberOne = Ember.VERSION.match(/1\.13/);

  Ember.Test.registerAsyncHelper('selectChoose', function(app, cssPath, value) {
    const id = find(cssPath).find('.ember-power-select-trigger').attr('id').match(/ember-power-select-trigger-ember(\d+)/)[1]
    // If the dropdown is closed, open it
    if (Ember.$(`.ember-power-select-dropdown-ember${id}`).length === 0) {
      nativeMouseDown(`${cssPath} .ember-power-select-trigger`);
      wait();
    }

    // Select the option with the given text
    andThen(function() {
      nativeMouseUp(`.ember-power-select-dropdown-ember${id} .ember-power-select-option:contains("${value}")`);
    });
  });

  Ember.Test.registerAsyncHelper('selectSearch', function(app, cssPath, value) {
    const id = find(cssPath).find('.ember-power-select-trigger').attr('id').match(/ember-power-select-trigger-ember(\d+)/)[1]
    const isMultipleSelect = Ember.$(`${cssPath} .ember-power-select-trigger-multiple-input`).length > 0;

    let dropdownIsClosed = Ember.$(`.ember-power-select-dropdown-ember${id}`).length === 0;
    if (dropdownIsClosed) {
      nativeMouseDown(`${cssPath} .ember-power-select-trigger`);
      wait();
    }

    if (isMultipleSelect) {
      fillIn(`${cssPath} .ember-power-select-trigger-multiple-input`, value);
      if (isEmberOne) {
        triggerEvent(`${cssPath} .ember-power-select-trigger-multiple-input`, 'input');
      }
    } else {
      fillIn('.ember-power-select-search input', value);
      if (isEmberOne) {
        triggerEvent(`.ember-power-select-dropdown-ember${id} .ember-power-select-search input`, 'input');
      }
    }

  });
}
