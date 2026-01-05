import Component from '@glimmer/component';
import { action } from '@ember/object';
import { runTask } from 'ember-lifeline';
import { tracked } from '@glimmer/tracking';
import RSVP from 'rsvp';
import PowerSelect from '#src/components/power-select.gts';
import { fn } from '@ember/helper';
import CustomTriggerWithSearch from '../components/custom-trigger-with-search.gts';

const numbers = [
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
  'twenty',
];

export default class HelpersTesting extends Component {
  numbers = numbers;
  @tracked selected: string | undefined = undefined;
  @tracked selected2: string | undefined = undefined;
  @tracked selected2Multi: string[] = [];
  @tracked selectedList: string[] = [];
  @tracked asyncSelected: string | undefined = undefined;
  @tracked asyncSelectedList: string[] = [];
  @tracked optionz: string[] = [];
  @tracked selected3: string | undefined;

  @action
  searchAsync(term: string): Promise<readonly string[]> {
    return new RSVP.Promise((resolve) => {
      runTask(
        this,
        () => {
          resolve(numbers.filter((n) => n.indexOf(term) > -1));
        },
        100,
      );
    });
  }

  @action
  onOpenHandle() {
    runTask(
      this,
      () => {
        this.optionz = numbers;
      },
      100,
    );
  }

  @action
  onChangeAsync(key: 'asyncSelected', selected: string | undefined) {
    runTask(
      this,
      () => {
        this[key] = selected;
      },
      100,
    );
  }

  @action
  onChangeAsyncMultiple(key: 'asyncSelectedList', selected: string[]) {
    runTask(
      this,
      () => {
        this[key] = selected;
      },
      100,
    );
  }

  <template>
    <h1>Helpers testing</h1>
    <div class="select-choose">
      <PowerSelect
        @options={{this.numbers}}
        @selected={{this.selected}}
        @onChange={{fn (mut this.selected)}}
        as |num|
      >
        {{num}}
      </PowerSelect>
    </div>

    <div class="select-choose-onopen">
      <PowerSelect
        @onOpen={{this.onOpenHandle}}
        @options={{this.optionz}}
        @selected={{this.selected}}
        @onChange={{fn (mut this.selected)}}
        @allowClear={{true}}
        as |num|
      >
        {{num}}
      </PowerSelect>
    </div>

    <div class="select-choose-onopen-multiple">
      <PowerSelect
        @multiple={{true}}
        @onOpen={{this.onOpenHandle}}
        @options={{this.optionz}}
        @selected={{this.selected2Multi}}
        @onChange={{fn (mut this.selected2Multi)}}
        as |num|
      >
        {{num}}
      </PowerSelect>
    </div>

    <div>
      <PowerSelect
        @triggerClass="select-with-class-in-trigger"
        @options={{this.numbers}}
        @selected={{this.selected}}
        @onChange={{fn (mut this.selected)}}
        @searchEnabled={{true}}
        as |num|
      >
        {{num}}
      </PowerSelect>
    </div>

    {{#if this.selected}}
      <span class="select-choose-target">You've selected:
        {{this.selected}}</span>
    {{/if}}

    <div class="select-async">
      <PowerSelect
        @selected={{this.selected}}
        @onChange={{fn (mut this.selected)}}
        @search={{this.searchAsync}}
        @searchEnabled={{true}}
        as |num|
      >
        {{num}}
      </PowerSelect>
    </div>

    <div class="select-multiple">
      <PowerSelect
        @multiple={{true}}
        @options={{this.numbers}}
        @selected={{this.selectedList}}
        @onChange={{fn (mut this.selectedList)}}
        @searchEnabled={{true}}
        as |num|
      >
        {{num}}
      </PowerSelect>
    </div>

    <div id="select-multiple-async">
      <PowerSelect
        @multiple={{true}}
        @options={{this.numbers}}
        @selected={{this.asyncSelectedList}}
        @onChange={{fn this.onChangeAsyncMultiple "asyncSelectedList"}}
        as |num|
      >
        {{num}}
      </PowerSelect>
    </div>

    <div class="select-deselect-async">
      <PowerSelect
        @options={{this.numbers}}
        @selected={{this.asyncSelected}}
        @onChange={{fn this.onChangeAsync "asyncSelected"}}
        @allowClear={{true}}
        as |num|
      >
        {{num}}
      </PowerSelect>
    </div>

    <h2 class="t3">Customized component</h2>
    <div class="select-custom-search">
      <PowerSelect
        @selected={{this.selected3}}
        @onChange={{fn (mut this.selected3)}}
        @search={{this.searchAsync}}
        @triggerComponent={{component CustomTriggerWithSearch}}
        as |num|
      >
        {{num}}
      </PowerSelect>
    </div>
  </template>
}
