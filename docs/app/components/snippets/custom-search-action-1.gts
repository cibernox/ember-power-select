import Component from '@glimmer/component';
import PowerSelect from 'ember-power-select/components/power-select';
import { tracked } from '@glimmer/tracking';
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

  async searchRepo(term: string) {
    const url = `https://api.github.com/search/repositories?q=${term}`;

    const response = await fetch(url);
    const json = (await response.json()) as ApiResult;

    return json.items;
  }

  <template>
    <PowerSelect
      @searchEnabled={{true}}
      @search={{this.searchRepo}}
      @selected={{this.selected}}
      @labelText="Repository"
      @onChange={{fn (mut this.selected)}}
      as |repo|
    >
      {{repo.full_name}}
    </PowerSelect>
    (It might fail if the API limit is exceeded)
  </template>
}
