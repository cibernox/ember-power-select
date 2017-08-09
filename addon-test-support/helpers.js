import { deprecate } from '@ember/debug';
import { registerAsyncHelper } from '@ember/test';
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
  return findAll(selector).filter((e) => e.textContent.trim().indexOf(text) > -1)[0];
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

export async function selectChoose(cssPathOrTrigger, valueOrSelector, optionIndex) {
  let trigger, target;
  if (cssPathOrTrigger instanceof HTMLElement) {
    if (cssPathOrTrigger.classList.contains('ember-power-select-trigger')) {
      trigger = cssPathOrTrigger;
    } else {
      trigger = find('.ember-power-select-trigger', cssPathOrTrigger);
    }
  } else {
    trigger = find(`${cssPathOrTrigger} .ember-power-select-trigger`);

    if (!trigger) {
      trigger = find(cssPathOrTrigger);
    }

    if (!trigger) {
      throw new Error(`You called "selectChoose('${cssPathOrTrigger}', '${valueOrSelector}')" but no select was found using selector "${cssPathOrTrigger}"`);
    }
  }

  if (trigger.scrollIntoView) {
    trigger.scrollIntoView();
  }

  let contentId = `${trigger.attributes['aria-owns'].value}`;
  let content = find(`#${contentId}`);
  // If the dropdown is closed, open it
  if (!content || content.classList.contains('ember-basic-dropdown-content-placeholder')) {
    await click(trigger);
    await wait();
  }

  // Select the option with the given text
  let options = findAll(`#${contentId} .ember-power-select-option`);
  let potentialTargets = options.filter((opt) => opt.textContent.indexOf(valueOrSelector) > -1);
  if (potentialTargets.length === 0) {
    // If treating the value as text doesn't gave use any result, let's try if it's a css selector
    let matchEq = valueOrSelector.slice(-6).match(/:eq\((\d+)\)/);
    if (matchEq) {
      let index = parseInt(matchEq[1], 10);
      let option = findAll(`#${contentId} ${valueOrSelector.slice(0, -6)}`)[index];
      deprecate('Passing selectors with the `:eq()` pseudoselector is deprecated. If you want to select the nth option, pass a number as a third argument. E.g `selectChoose(".language-select", ".ember-power-select-option", 3)`', true, {
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
    let filteredTargets = [].slice.apply(potentialTargets).filter((t) => t.textContent.trim() === valueOrSelector);
    if (optionIndex === undefined) {
      target = filteredTargets[0] || potentialTargets[0];
    } else {
      target = filteredTargets[optionIndex] || potentialTargets[optionIndex];
    }
  } else {
    target = potentialTargets[0];
  }
  if (!target) {
    throw new Error(`You called "selectChoose('${cssPathOrTrigger}', '${valueOrSelector}')" but "${valueOrSelector}" didn't match any option`);
  }
  await click(target);
  return wait();
}

// Helpers for acceptance tests

export default function() {
  registerAsyncHelper('selectChoose', function(_, cssPathOrTrigger, valueOrSelector, optionIndex) {
    return selectChoose(cssPathOrTrigger, valueOrSelector, optionIndex);
  });

  registerAsyncHelper('selectSearch', async function(app, cssPathOrTrigger, value) {
    let trigger;
    if (cssPathOrTrigger instanceof HTMLElement) {
      trigger = cssPathOrTrigger;
    } else {
      let triggerPath = `${cssPathOrTrigger} .ember-power-select-trigger`;
      trigger = find(triggerPath);
      if (!trigger) {
        triggerPath = cssPathOrTrigger;
        trigger = find(triggerPath);
      }

      if (!trigger) {
        throw new Error(`You called "selectSearch('${cssPathOrTrigger}', '${value}')" but no select was found using selector "${cssPathOrTrigger}"`);
      }
    }

    if (trigger.scrollIntoView) {
      trigger.scrollIntoView();
    }

    let contentId = `${trigger.attributes['aria-owns'].value}`;
    let isMultipleSelect = !!find('.ember-power-select-trigger-multiple-input', trigger);

    let content = find(`#${contentId}`);
    let dropdownIsClosed = !content || content.classList.contains('ember-basic-dropdown-content-placeholder');
    if (dropdownIsClosed) {
      await click(trigger);
      await wait();
    }
    let isDefaultSingleSelect = !!find('.ember-power-select-search-input');

    if (isMultipleSelect) {
      await fillIn(find('.ember-power-select-trigger-multiple-input', trigger), value);
    } else if (isDefaultSingleSelect) {
      await fillIn('.ember-power-select-search-input', value);
    } else { // It's probably a customized version
      let inputIsInTrigger = !!find('.ember-power-select-trigger input[type=search]', trigger);
      if (inputIsInTrigger) {
        await fillIn(find('input[type=search]', trigger), value);
      } else {
        await fillIn(`#${contentId} .ember-power-select-search-input[type=search]`, 'input');
      }
    }
    return wait();
  });

  registerAsyncHelper('removeMultipleOption', async function(app, cssPath, value) {
    let elem;
    let items = findAll(`${cssPath} .ember-power-select-multiple-options > li`);
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

  registerAsyncHelper('clearSelected', async function(app, cssPath) {
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
