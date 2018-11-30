import { deprecate } from '@ember/debug';
import { registerAsyncHelper } from '@ember/test';
import { click, fillIn, triggerKeyEvent, triggerEvent } from '@ember/test-helpers';
import {
  selectChoose as _selectChoose,
  selectSearch as _selectSearch,
  removeMultipleOption as _removeMultipleOption,
  clearSelected as _clearSelected
} from './index';
/**
 * @private
 * @param {String} selector CSS3 selector of the elements to check the content
 * @param {String} text Substring that the selected element must contain
 * @returns HTMLElement The first element that maches the given selector and contains the
 *                      given text
 */
export function findContains(selector, text) {
  return [].slice.apply(document.querySelectorAll(selector)).filter((e) => {
    return e.textContent.trim().indexOf(text) > -1
  })[0];
}

export async function nativeMouseDown(selectorOrDomElement, options) {
  return triggerEvent(selectorOrDomElement, 'mousedown', options);
}

export async function nativeMouseUp(selectorOrDomElement, options) {
  return triggerEvent(selectorOrDomElement, 'mouseup', options);
}

export async function triggerKeydown(domElement, k) {
  return triggerKeyEvent(domElement, 'keydown', k);
}

export function typeInSearch(scopeOrText, text) {
  let scope = '';

  if (typeof text === 'undefined') {
    text = scopeOrText;
  } else {
    scope = scopeOrText;
  }

  let selectors = [
    '.ember-power-select-search-input',
    '.ember-power-select-search input',
    '.ember-power-select-trigger-multiple-input',
    'input[type="search"]'
  ].map((selector) => `${scope} ${selector}`).join(', ');

  return fillIn(selectors, text);
}

export async function clickTrigger(scope, options = {}) {
  let selector = '.ember-power-select-trigger';
  if (scope) {
    selector = `${scope} ${selector}`;
  }
  return click(selector, options);
}

export async function nativeTouch(selectorOrDomElement) {
  triggerEvent(selectorOrDomElement, 'touchstart');
  return triggerEvent(selectorOrDomElement, 'touchend');
}

export async function touchTrigger() {
  return nativeTouch('.ember-power-select-trigger');
}

export async function selectChoose(cssPathOrTrigger, valueOrSelector, optionIndex) {
  return _selectChoose(cssPathOrTrigger, valueOrSelector, optionIndex);
}

export async function selectSearch(cssPathOrTrigger, value) {
  return _selectSearch(cssPathOrTrigger, value);
}

export async function removeMultipleOption(cssPath, value) {
  return _removeMultipleOption(cssPath, value);
}

export async function clearSelected(cssPath) {
  return _clearSelected(cssPath);
}

// Helpers for acceptance tests
export default function() {
  registerAsyncHelper('selectChoose', function(_, cssPathOrTrigger, valueOrSelector, optionIndex) {
    deprecate(
      'Using the implicit global async helper `selectChoose` is deprecated. Please, import it explicitly with `import { selectChoose } from "ember-power-select/test-support"`',
      true,
      { id: 'ember-power-select-global-select-choose', until: '2.0.0' }
    );
    return _selectChoose(cssPathOrTrigger, valueOrSelector, optionIndex);
  });

  registerAsyncHelper('selectSearch', async function(app, cssPathOrTrigger, value) {
    deprecate(
      'Using the implicit global async helper `selectSearch` is deprecated. Please, import it explicitly with `import { selectSearch } from "ember-power-select/test-support"`',
      true,
      { id: 'ember-power-select-global-select-search', until: '2.0.0' }
    );
    return _selectSearch(cssPathOrTrigger, value);
  });

  registerAsyncHelper('removeMultipleOption', async function(app, cssPath, value) {
    deprecate(
      'Using the implicit global async helper `removeMultipleOption` is deprecated. Please, import it explicitly with `import { removeMultipleOption } from "ember-power-select/test-support"`',
      true,
      { id: 'ember-power-select-global-remove-multiple-option', until: '2.0.0' }
    );
    return _removeMultipleOption(cssPath, value);
  });

  registerAsyncHelper('clearSelected', async function(app, cssPath) {
    deprecate(
      'Using the implicit global async helper `clearSelected` is deprecated. Please, import it explicitly with `import { clearSelected } from "ember-power-select/test-support"`',
      true,
      { id: 'ember-power-select-global-clear-selected', until: '2.0.0' }
    );
    return _clearSelected(cssPath);
  });
}
