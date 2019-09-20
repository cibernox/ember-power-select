import Controller from '@ember/controller';
import { get, action } from '@ember/object';
export default class extends Controller {
  @action
  onChange(levelOrOption, dropdown) {
    if (get(levelOrOption, 'levelName')) {
      this.set('currentOptions', get(levelOrOption, 'options'));
    } else if (levelOrOption.parentLevel) {
      this.set('currentOptions', levelOrOption.parentLevel.options);
    } else {
      this.get('onChange')(levelOrOption);
      dropdown.actions.close();
      this.set('currentOptions', this.get('transformedOptions'));
    }
  }

  @action
  search(term) {
    let normalizedTerm = term.toLowerCase();
    let results = this.currentOptions.filter(o => {
      if (o.parentLevel) {
        return normalizedTerm === '';
      } else if (get(o, 'levelName')) {
        return get(o, 'levelName').toLowerCase().indexOf(normalizedTerm) > -1;
      } else {
        return o.toLowerCase().indexOf(normalizedTerm) > -1;
      }
    });
    results.fromSearch = true;
    return results;
  }
}
