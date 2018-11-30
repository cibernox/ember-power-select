import Controller from '@ember/controller';
import { get } from '@ember/object';
export default Controller.extend({
  actions: {
    onchange(levelOrOption, dropdown) {
      if (get(levelOrOption, 'levelName')) {
        this.set('currentOptions', get(levelOrOption, 'options'));
      } else if (levelOrOption.parentLevel) {
        this.set('currentOptions', levelOrOption.parentLevel.options);
      } else {
        this.get('onchange')(levelOrOption);
        dropdown.actions.close();
        this.set('currentOptions', this.get('transformedOptions'));
      }
    },

    search(term) {
      let normalizedTerm = term.toLowerCase();
      let results = this.get('currentOptions').filter(o => {
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
});
