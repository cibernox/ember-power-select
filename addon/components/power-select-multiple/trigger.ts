import Component from '@glimmer/component';
import { action } from '@ember/object';
import { get } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import { Select } from '../power-select';

interface Args {
  select: Select;
  placeholder?: string;
  searchField: string;
  placeholderComponent?: string;
  onInput?: (e: InputEvent) => boolean;
  onKeydown?: (e: KeyboardEvent) => boolean;
  buildSelection: (lastSelection: any, select: Select) => any[];
}
interface IndexAccesible<T> {
  objectAt(index: number): T;
}
const isIndexAccesible = <T>(target: any): target is IndexAccesible<T> => {
  return typeof target.objectAt === 'function';
};

export default class Trigger extends Component<Args> {
  private _lastIsOpen: boolean = this.args.select.isOpen;

  // Actions
  @action
  openChanged(_el: Element, [isOpen]: [boolean]) {
    if (isOpen === false && this._lastIsOpen === true) {
      scheduleOnce('actions', null, this.args.select.actions.search, '');
    }
    this._lastIsOpen = isOpen;
  }

  @action
  chooseOption(e: Event) {
    if (e.target === null) return;
    let selectedIndex = (e.target as Element).getAttribute(
      'data-selected-index'
    );
    if (selectedIndex) {
      let numericIndex = parseInt(selectedIndex, 10);
      e.stopPropagation();
      e.preventDefault();
      let object = this.selectedObject(this.args.select.selected, numericIndex);
      this.args.select.actions.choose(object);
    }
  }

  selectedObject<T>(list: IndexAccesible<T> | T[], index: number): T {
    if (isIndexAccesible(list)) {
      return list.objectAt(index);
    } else {
      return get(list, index) as T;
    }
  }
}
