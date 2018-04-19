import { click, fillIn, settled, find, findAll } from '@ember/test-helpers';
import { warn } from '@ember/debug';

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

function nativeMouseDown(selectorOrDomElement, options) {
  fireNativeMouseEvent('mousedown', selectorOrDomElement, options);
}

function nativeMouseUp(selectorOrDomElement, options) {
  fireNativeMouseEvent('mouseup', selectorOrDomElement, options);
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

  let contentId = `${trigger.attributes['aria-controls'].value}`;
  let content = find(`#${contentId}`);
  // If the dropdown is closed, open it
  if (!content || content.classList.contains('ember-basic-dropdown-content-placeholder')) {
    await nativeMouseDown(trigger);
    await settled();
  }

  // Select the option with the given text
  let options = findAll(`#${contentId} .ember-power-select-option`);
  let potentialTargets = options.filter((opt) => opt.textContent.indexOf(valueOrSelector) > -1);
  if (potentialTargets.length === 0) {
    potentialTargets = findAll(`#${contentId} ${valueOrSelector}`);
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
  return settled();
}

export async function selectSearch(cssPathOrTrigger, value) {
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

  let contentId = `${trigger.attributes['aria-controls'].value}`;
  let isMultipleSelect = !!find(`#${trigger.id} .ember-power-select-trigger-multiple-input`);

  let content = find(`#${contentId}`);
  let dropdownIsClosed = !content || content.classList.contains('ember-basic-dropdown-content-placeholder');
  if (dropdownIsClosed) {
    await click(trigger);
    await settled();
  }
  let isDefaultSingleSelect = !!find('.ember-power-select-search-input');

  if (isMultipleSelect) {
    await fillIn(find(`#${trigger.id} .ember-power-select-trigger-multiple-input`), value);
  } else if (isDefaultSingleSelect) {
    await fillIn('.ember-power-select-search-input', value);
  } else { // It's probably a customized version
    let inputIsInTrigger = !!find(`#${trigger.id} .ember-power-select-trigger input[type=search]`);
    if (inputIsInTrigger) {
      await fillIn(find('#${trigger.id} input[type=search]', trigger), value);
    } else {
      await fillIn(`#${contentId} .ember-power-select-search-input[type=search]`, 'input');
    }
  }
  return settled();
}

export async function removeMultipleOption(cssPath, value) {
  let elem;
  let items = findAll(`${cssPath} .ember-power-select-multiple-options > li`);
  let item = items.find((el) => el.textContent.indexOf(value) > -1);
  if (item) {
    elem = find('.ember-power-select-multiple-remove-btn', item);
  }
  try {
    await click(elem);
    return settled();
  } catch(e) {
    warn('css path to remove btn not found');
    throw e;
  }
}

export async function clearSelected(cssPath) {
  let elem = find(`${cssPath} .ember-power-select-clear-btn`);
  try {
    await click(elem);
    return settled();
  } catch(e) {
    warn('css path to clear btn not found');
    throw e;
  }
}
