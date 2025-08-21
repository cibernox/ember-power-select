import { action } from '@ember/object';
import { get } from '@ember/object';
import { scheduleTask } from 'ember-lifeline';
import type { Selected } from '../power-select-multiple';
import type { ComponentLike } from '@glint/template';
import { modifier } from 'ember-modifier';
import { deprecate } from '@ember/debug';
import PowerSelectMultipleInputComponent, { type PowerSelectMultipleInputSignature } from './input.ts';
import PowerSelectTriggerComponent from '../power-select/trigger.ts';

export default class TriggerComponent<
  T = unknown,
  TExtra = undefined,
> extends PowerSelectTriggerComponent<T, TExtra, true> {
  private _lastIsOpen: boolean = this.args.select.isOpen;

  get inputMultipleComponent() {
    return PowerSelectMultipleInputComponent as unknown as ComponentLike<PowerSelectMultipleInputSignature<T>>;
  }

  isOptionDisabled(option: T): boolean {
    if (option && typeof option === 'object' && 'disabled' in option) {
      return option.disabled as boolean;
    }

    return false;
  }

  // Actions
  @action
  openChanged(element: Element, [isOpen]: [boolean]) {
    deprecate(
      'You are using a power-select-multiple trigger with ember/render-modifier. Replace {{did-update this.openChanged @select.isOpen}} with {{this.openChange @select.isOpen}}.',
      false,
      {
        for: 'ember-power-select',
        id: 'ember-power-select.no-at-ember-render-modifiers',
        since: {
          enabled: '8.1',
          available: '8.1',
        },
        until: '9.0.0',
      },
    );

    this._openChanged(element, [isOpen]);
  }

  @action
  chooseOption(e: Event) {
    if (e.target === null) return;
    const selectedIndex = (e.target as Element).getAttribute(
      'data-selected-index',
    );
    if (selectedIndex) {
      const numericIndex = parseInt(selectedIndex, 10);
      e.stopPropagation();
      e.preventDefault();
      const object = this.selectedObject(
        this.args.select.selected,
        numericIndex,
      );
      this.args.select.actions.choose(object);
    }
  }

  openChange = modifier((element: Element, [isOpen]: [boolean]) => {
    this._openChanged(element, [isOpen]);
  });

  private _openChanged(_el: Element, [isOpen]: [boolean]) {
    if (isOpen === false && this._lastIsOpen === true) {
      scheduleTask(this, 'actions', () => {
        this.args.select.actions?.search('');
      });
    }
    this._lastIsOpen = isOpen;
  }

  selectedObject<T>(list: Selected<T>, index: number): T {
    if (list && 'objectAt' in list && typeof list.objectAt === 'function') {
      return list.objectAt(index) as T;
    } else {
      return get(list as T[], index) as T;
    }
  }
}
