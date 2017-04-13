import Ember from 'ember';
import Test from 'ember-test';
import wait from 'ember-test-helpers/wait';
import { click, fillIn, keyEvent, triggerEvent, find, findAll } from 'ember-native-dom-helpers';
/**
 * @private
 * @param {String} selector CSS3 selector of the elements to check the content
 * @param {String} text Substring that the selected element must contain
 * @returns HTMLElement The first element that maches the given selector and contains the
 *                      given text
 */
export function findContains(selector, text) {
  return [].slice.apply(findAll(selector)).filter((e) => e.textContent.trim().indexOf(text) > -1)[0];
}

export function nativeMouseDown(selectorOrDomElement, options) {
  triggerEvent(selectorOrDomElement, 'mousedown', options);
}

export function nativeMouseUp(selectorOrDomElement, options) {
  triggerEvent(selectorOrDomElement, 'mouseup', options);
}

export function triggerKeydown(domElement, k) {
  keyEvent(domElement, 'keydown', k);
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

export function clickTrigger(scope, options = {}) {
  let selector = '.ember-power-select-trigger';
  if (scope) {
    selector = `${scope} ${selector}`;
  }
  return click(selector, options);
}

export function nativeTouch(selectorOrDomElement) {
  triggerEvent(selectorOrDomElement, 'touchstart');
  triggerEvent(selectorOrDomElement, 'touchend');
}

export function touchTrigger() {
  nativeTouch('.ember-power-select-trigger');
}

// Helpers for acceptance tests

export default function() {
  Test.registerAsyncHelper('selectChoose', async function(app, cssPath, valueOrSelector, optionIndex) {
    let trigger = find(`${cssPath} .ember-power-select-trigger`);

    if (!trigger) {
      trigger = find(cssPath);
    }

    if (!trigger) {
      throw new Error(`You called "selectChoose('${cssPath}', '${valueOrSelector}')" but no select was found using selector "${cssPath}"`);
    }

    let contentId = `${trigger.attributes['aria-owns'].value}`;
    let content = find(`#${contentId}`);
    // If the dropdown is closed, open it
    if (!content || content.classList.contains('ember-basic-dropdown-content-placeholder')) {
      await click(trigger);
      await wait();
    }

    // Select the option with the given text
    let options = [].slice.apply(findAll(`#${contentId} .ember-power-select-option`));
    let potentialTargets = options.filter((opt) => opt.textContent.indexOf(valueOrSelector) > -1);
    let target;
    if (potentialTargets.length === 0) {
      // If treating the value as text doesn't gave use any result, let's try if it's a css selector
      let matchEq = valueOrSelector.slice(-6).match(/:eq\((\d+)\)/);
      if (matchEq) {
        let index = parseInt(matchEq[1], 10);
        let option = findAll(`#${contentId} ${valueOrSelector.slice(0, -6)}`)[index];
        Ember.deprecate('Passing selectors with the `:eq()` pseudoselector is deprecated. If you want to select the nth option, pass a number as a third argument. E.g `selectChoose(".language-select", ".ember-power-select-option", 3)`', true, {
          id: 'select-choose-no-eq-pseudoselector',
          until: '1.8.0'
        });
        if (option) {
          potentialTargets = [option];
        }
      } else {
        potentialTargets = findAll(`#${contentId} ${valueOrSelector}`);
      }
    }
    if (potentialTargets.length > 1) {
      target = potentialTargets.filter((t) => t.textContent.trim() === valueOrSelector)[0] || potentialTargets[0];
    } else {
      target = potentialTargets[0];
    }
    if (!target) {
      throw new Error(`You called "selectChoose('${cssPath}', '${valueOrSelector}')" but "${valueOrSelector}" didn't match any option`);
    }
    await click(target);
    return wait();
  });

  Test.registerAsyncHelper('selectSearch', async function(app, cssPath, value) {
    let triggerPath = `${cssPath} .ember-power-select-trigger`;
    let trigger = find(triggerPath);
    if (!trigger) {
      triggerPath = cssPath;
      trigger = find(triggerPath);
    }

    if (!trigger) {
      throw new Error(`You called "selectSearch('${cssPath}', '${value}')" but no select was found using selector "${cssPath}"`);
    }

    let contentId = `${trigger.attributes['aria-owns'].value}`;
    let isMultipleSelect = !!find(`${cssPath} .ember-power-select-trigger-multiple-input`);

    let content = find(`#${contentId}`);
    let dropdownIsClosed = !content || content.classList.contains('ember-basic-dropdown-content-placeholder');
    if (dropdownIsClosed) {
      await click(triggerPath);
      await wait();
    }
    let isDefaultSingleSelect = !!find('.ember-power-select-search-input');

    if (isMultipleSelect) {
      await fillIn(`${triggerPath} .ember-power-select-trigger-multiple-input`, value);
    } else if (isDefaultSingleSelect) {
      await fillIn('.ember-power-select-search-input', value);
    } else { // It's probably a customized version
      let inputIsInTrigger = !!find(`${cssPath} .ember-power-select-trigger input[type=search]`);
      if (inputIsInTrigger) {
        await fillIn(`${triggerPath} input[type=search]`, value);
      } else {
        await fillIn(`#${contentId} .ember-power-select-search-input[type=search]`, 'input');
      }
    }
    return wait();
  });

  Test.registerAsyncHelper('removeMultipleOption', async function(app, cssPath, value) {
    let elem;
    let items = [].slice.apply(findAll(`${cssPath} .ember-power-select-multiple-options > li`));
    let item = items.find((el) => el.textContent.indexOf(value) > -1);
    if (item) {
      elem = find('.ember-power-select-multiple-remove-btn', item);
    }
    try {
      await click(elem);
      return wait();
    } catch(e) {
      console.warn('css path to remove btn not found');
      throw e;
    }
  });

  Test.registerAsyncHelper('clearSelected', async function(app, cssPath) {
    let elem = find(`${cssPath} .ember-power-select-clear-btn`);
    try {
      await click(elem);
      return wait();
    } catch(e) {
      console.warn('css path to clear btn not found');
      throw e;
    }
  });
}
