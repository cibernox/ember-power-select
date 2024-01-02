import {
  click,
  fillIn,
  triggerKeyEvent,
  triggerEvent,
} from '@ember/test-helpers';
/**
 * @private
 * @param {String} selector CSS3 selector of the elements to check the content
 * @param {String} text Substring that the selected element must contain
 * @returns HTMLElement The first element that maches the given selector and contains the
 *                      given text
 */
export function findContains(selector, text) {
  return [].slice.apply(document.querySelectorAll(selector)).filter((e) => {
    return e.textContent.trim().indexOf(text) > -1;
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
    'input[type="search"]',
  ]
    .map((selector) => `${scope} ${selector}`)
    .join(', ');

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
