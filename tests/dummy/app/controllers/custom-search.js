import Controller from '@ember/controller';
import { task, timeout } from 'ember-concurrency';

export default Controller.extend({
  searchTask: task(function*(query) {
    yield timeout(300);
    const searchOptions = [
      { text: `Suggestion: ${query} 1` },
      { text: `Suggestion: ${query} 2` },
      { text: `Suggestion: ${query} 3` },
      { text: `Suggestion: ${query} 4` },
      { text: `Suggestion: ${query} 5` }
    ];
    this.set('options', searchOptions);
  }),

  actions: {
    select(selected) {
      this.set('selected', selected);
    }
  }
});
