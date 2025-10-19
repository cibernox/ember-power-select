import Component from '@glimmer/component';
import PowerSelect from 'ember-power-select/components/power-select';
import { tracked } from '@glimmer/tracking';
import { task, timeout } from 'ember-concurrency';
import { fn } from '@ember/helper';

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

  searchRepo = task(async (term) => {
    await timeout(600);
    const url = `https://api.github.com/search/repositories?q=${term}`;

    return fetch(url)
      .then((resp) => resp.json())
      .then((json: ApiResult) => json.items);
  });

  <template>
    <PowerSelect
      @searchEnabled={{true}}
      @search={{this.searchRepo.perform}}
      @selected={{this.selected}}
      @labelText="Repository"
      @onChange={{fn (mut this.selected)}}
      as |repo|
    >
      {{repo.full_name}}
    </PowerSelect>
  </template>
}
