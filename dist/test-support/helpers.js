import { triggerEvent, triggerKeyEvent, fillIn, click } from '@ember/test-helpers';

/**
 * @private
 * @param {String} selector CSS3 selector of the elements to check the content
 * @param {String} text Substring that the selected element must contain
 * @returns HTMLElement The first element that maches the given selector and contains the
 *                      given text
 */
function findContains(selector, text) {
  return Array.from(document.querySelectorAll(selector)).filter(e => {
    return (e.textContent ?? '').indexOf(text) > -1;
  })[0];
}
async function nativeMouseDown(selectorOrDomElement, options) {
  return triggerEvent(selectorOrDomElement, 'mousedown', options);
}
async function nativeMouseUp(selectorOrDomElement, options) {
  return triggerEvent(selectorOrDomElement, 'mouseup', options);
}
async function triggerKeydown(domElement, k) {
  return triggerKeyEvent(domElement, 'keydown', k);
}
function typeInSearch(scopeOrText, text) {
  let scope = '';
  if (typeof text === 'undefined') {
    text = scopeOrText;
  } else {
    scope = scopeOrText;
  }
  const selectors = ['.ember-power-select-search-input', '.ember-power-select-search input', '.ember-power-select-trigger-multiple-input', 'input[type="search"]'].map(selector => `${scope} ${selector}`).join(', ');
  return fillIn(selectors, text);
}
async function clickTrigger(scope, options) {
  let selector = '.ember-power-select-trigger';
  if (scope) {
    selector = `${scope} ${selector}`;
  }
  return click(selector, options);
}
async function nativeTouch(selectorOrDomElement) {
  triggerEvent(selectorOrDomElement, 'touchstart');
  return triggerEvent(selectorOrDomElement, 'touchend');
}
async function touchTrigger() {
  return nativeTouch('.ember-power-select-trigger');
}

export { clickTrigger, findContains, nativeMouseDown, nativeMouseUp, nativeTouch, touchTrigger, triggerKeydown, typeInSearch };
//# sourceMappingURL=helpers.js.map
