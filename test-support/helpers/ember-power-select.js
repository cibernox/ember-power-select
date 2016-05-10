import Ember from 'ember';

// Helpers for integration tests

function typeText(selector, text) {
  let $selector = $(selector);
  $selector.val(text);
  let event = document.createEvent('Events');
  event.initEvent('input', true, true);
  $selector[0].dispatchEvent(event);
}

function fireNativeMouseEvent(eventType, selectorOrDomElement, options = {}) {
  let event = new window.Event(eventType, { bubbles: true, cancelable: true, view: window });
  Object.keys(options).forEach((key) => event[key] = options[key]);
  let target;
  if (typeof selectorOrDomElement === 'string') {
    target = Ember.$(selectorOrDomElement)[0];
  } else {
    target = selectorOrDomElement;
  }
  Ember.run(() => target.dispatchEvent(event));
}

export function nativeMouseDown(selectorOrDomElement, options) {
  fireNativeMouseEvent('mousedown', selectorOrDomElement, options);
}

export function nativeMouseUp(selectorOrDomElement, options) {
  fireNativeMouseEvent('mouseup', selectorOrDomElement, options);
}

export function triggerKeydown(domElement, k) {
  let oEvent = document.createEvent('Events');
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
    selector = `${scope} ${selector}`;
  }
  nativeMouseDown(selector, options);
}

export function nativeTouch(selectorOrDomElement) {
  let event = new window.Event('touchstart', { bubbles: true, cancelable: true, view: window });
  let target;

  if (typeof selectorOrDomElement === 'string') {
    target = Ember.$(selectorOrDomElement)[0];
  } else {
    target = selectorOrDomElement;
  }
  Ember.run(() => target.dispatchEvent(event));
  Ember.run(() => {
    event = new window.Event('touchend', { bubbles: true, cancelable: true, view: window });
    target.dispatchEvent(event);
  });
}

export function touchTrigger() {
  let selector = '.ember-power-select-trigger';
  nativeTouch(selector);
}

// Helpers for acceptance tests

export default function() {
  const isEmberOne = Ember.VERSION.match(/1\.13/);

  Ember.Test.registerAsyncHelper('selectChoose', function(app, cssPath, value) {
    const id = find(cssPath).find('.ember-power-select-trigger').attr('id').replace(/\D/g, '');
    // If the dropdown is closed, open it
    if (Ember.$(`.ember-power-select-dropdown-ember${id}`).length === 0) {
      nativeMouseDown(`${cssPath} .ember-power-select-trigger`);
      wait();
    }

    // Select the option with the given text
    andThen(function() {
      let potentialTargets = $(`.ember-power-select-dropdown-ember${id} .ember-power-select-option:contains("${value}")`).toArray();
      let target;
      if (potentialTargets.length > 1) {
        target = Ember.A(potentialTargets).find((t) => t.textContent.trim() === value) || potentialTargets[0];
      } else {
        target = potentialTargets[0];
      }
      nativeMouseUp(target);
    });
  });

  Ember.Test.registerAsyncHelper('selectSearch', function(app, cssPath, value) {
    const id = find(cssPath).find('.ember-power-select-trigger').attr('id').replace(/\D/g, '');
    const isMultipleSelect = Ember.$(`${cssPath} .ember-power-select-trigger-multiple-input`).length > 0;

    let dropdownIsClosed = Ember.$(`.ember-power-select-dropdown-ember${id}`).length === 0;
    if (dropdownIsClosed) {
      nativeMouseDown(`${cssPath} .ember-power-select-trigger`);
      wait();
    }
    const isDefaultSingleSelect = Ember.$(`.ember-power-select-search input`).length > 0;

    if (isMultipleSelect) {
      fillIn(`${cssPath} .ember-power-select-trigger-multiple-input`, value);
      if (isEmberOne) {
        triggerEvent(`${cssPath} .ember-power-select-trigger-multiple-input`, 'input');
      }
    } else if (isDefaultSingleSelect) {
      fillIn('.ember-power-select-search input', value);
      if (isEmberOne) {
        triggerEvent(`.ember-power-select-dropdown-ember${id} .ember-power-select-search input`, 'input');
      }
    } else { // It's probably a customized version
      let inputIsInTrigger = !!find(`${cssPath} .ember-power-select-trigger input[type=search]`)[0];
      if (inputIsInTrigger) {
        fillIn(`${cssPath} .ember-power-select-trigger input[type=search]`, value);
        if (isEmberOne) {
          triggerEvent(`${cssPath} .ember-power-select-trigger input[type=search]`, 'input');
        }
      } else {
        fillIn(`.ember-power-select-dropdown-ember${id} .ember-power-select-search input[type=search]`, 'input');
        if (isEmberOne) {
          triggerEvent(`.ember-power-select-dropdown-ember${id} .ember-power-select-search input[type=search]`, 'input');
        }
      }
    }

  });

  Ember.Test.registerAsyncHelper('removeMultipleOption', function(app, cssPath, value) {
    const elem = find(`${cssPath} .ember-power-select-multiple-options > li:contains(${value}) > .ember-power-select-multiple-remove-btn`).get(0);
    try {
      nativeMouseDown(elem);
    } catch (e) {
      console.warn('css path to remove btn not found');
      throw e;
    }
  });

  Ember.Test.registerAsyncHelper('clearSelected', function(app, cssPath) {
    const elem = find(`${cssPath} .ember-power-select-clear-btn`).get(0);
    try {
      nativeMouseDown(elem);
    } catch (e) {
      console.warn('css path to clear btn not found');
      throw e;
    }
  });
}
