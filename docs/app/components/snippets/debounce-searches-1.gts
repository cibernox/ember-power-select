import Component from '@glimmer/component';
import { fn } from '@ember/helper';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { restartableTask, timeout } from 'ember-concurrency';
import PowerSelect from 'ember-power-select/components/power-select';
import RSVP from 'rsvp';

interface ApiResult {
  total_count: number;
  incomplete_results: boolean;
  items: ApiResultItem[];
}

interface ApiResultItem {
  full_name: string;
}

export default class extends Component {
  @tracked selected: ApiResultItem | undefined;

  @action
  searchRepo(term: string): RSVP.Promise<ApiResultItem[]> {
    return new RSVP.Promise<ApiResultItem[]>((resolve, reject) => {
      void this._performSearch.perform(term, resolve, reject);
    });
  }

  _performSearch = restartableTask(
    async (
      term: string,
      resolve: (items: ApiResultItem[]) => void,
      reject: (reason?: unknown) => void
    ) => {
      await timeout(600);
      const url = `https://api.github.com/search/repositories?q=${term}`;

      await fetch(url)
        .then((resp) => resp.json())
        .then((json: ApiResult) => resolve(json.items), reject);
    }
  );

  <template>
    <PowerSelect
      @search={{this.searchRepo}}
      @selected={{this.selected}}
      @onChange={{fn (mut this.selected)}}
      @labelText="Repository"
      @searchEnabled={{true}}
      as |repo|
    >
      {{repo.full_name}}
    </PowerSelect>
  </template>
}
