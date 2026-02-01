import {
  click,
  fillIn,
  triggerKeyEvent,
  triggerEvent,
  type Target,
} from '@ember/test-helpers';
/**
 * @private
 * @param {String} selector CSS3 selector of the elements to check the content
 * @param {String} text Substring that the selected element must contain
 * @returns HTMLElement The first element that maches the given selector and contains the
 *                      given text
 */
export function findContains(
  selector: string,
  text: string,
  rootElement?: HTMLElement | Element,
) {
  let element = document.querySelectorAll(selector);
  if (rootElement) {
    element = rootElement.querySelectorAll(selector);
  }
  return Array.from(element).filter((e) => {
    return (e.textContent ?? '').indexOf(text) > -1;
  })[0];
}

export async function nativeMouseDown(
  selectorOrDomElement: Parameters<typeof triggerEvent>[0],
  options?: Parameters<typeof triggerEvent>[2],
) {
  return triggerEvent(selectorOrDomElement, 'mousedown', options);
}

export async function nativeMouseUp(
  selectorOrDomElement: Parameters<typeof triggerEvent>[0],
  options?: Parameters<typeof triggerEvent>[2],
) {
  return triggerEvent(selectorOrDomElement, 'mouseup', options);
}

export async function triggerKeydown(
  domElement: Parameters<typeof triggerKeyEvent>[0],
  k: Parameters<typeof triggerKeyEvent>[2],
) {
  return triggerKeyEvent(domElement, 'keydown', k);
}

export function typeInSearch(
  scopeOrText: string,
  text?: string,
  rootElement?: HTMLElement | Element,
) {
  let scope = '';

  if (typeof text === 'undefined') {
    text = scopeOrText;
  } else {
    scope = scopeOrText;
  }

  const selectors = [
    '.ember-power-select-search-input',
    '.ember-power-select-search input',
    '.ember-power-select-trigger-multiple-input',
    'input[type="search"]',
  ]
    .map((selector) => `${scope} ${selector}`)
    .join(', ');

  if (rootElement) {
    const selector = rootElement.querySelector(selectors);
    if (selector) {
      return fillIn(selector, text);
    }

    return;
  }

  return fillIn(selectors, text);
}

export async function clickTrigger(
  scope?: Target | string,
  options?: Parameters<typeof click>[1],
) {
  let selector = scope;
  if (!selector || typeof scope !== 'object') {
    selector = '.ember-power-select-trigger';
    if (scope) {
      selector = `${scope as string} ${selector}`;
    }
  }

  return click(selector, options);
}

export async function nativeTouch(
  selectorOrDomElement: Parameters<typeof triggerEvent>[1],
) {
  void triggerEvent(selectorOrDomElement, 'touchstart');
  return triggerEvent(selectorOrDomElement, 'touchend');
}

export async function touchTrigger() {
  return nativeTouch('.ember-power-select-trigger');
}
