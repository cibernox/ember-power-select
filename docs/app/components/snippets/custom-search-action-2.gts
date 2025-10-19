import Component from '@glimmer/component';
import PowerSelect from 'ember-power-select/components/power-select';
import { tracked } from '@glimmer/tracking';
import { fn } from '@ember/helper';
import { task, timeout } from 'ember-concurrency';

interface ApiResult {
  total_count: number;
  incomplete_results: boolean;
  items: ApiResultItem[]
}

interface ApiResultItem {
  full_name: string;
}

export default class extends Component {
  @tracked selected: ApiResultItem | undefined;

  searchTask = task(async (term) => {
    await timeout(1500);
    const url = `https://api.github.com/search/repositories?q=${term}`;

    return fetch(url)
      .then((resp) => resp.json())
      .then((json: ApiResult) => json.items);
  });

  <template>
    <PowerSelect
      @search={{this.searchTask.perform}}
      @searchEnabled={{true}}
      @selected={{this.selected}}
      @labelText="Repository"
      @onChange={{fn (mut this.selected)}}
      as |repo|
    >
      {{repo.full_name}}
    </PowerSelect>
  </template>
}
