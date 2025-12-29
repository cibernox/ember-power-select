import RouteTemplate from 'ember-route-template';
import PowerSelect from 'ember-power-select/components/power-select';
import { fn } from '@ember/helper';
import PowerSelectMultiple from 'ember-power-select/components/power-select-multiple';
import CustomTriggerWithSearch from '../components/custom-trigger-with-search';
import type HelpersTesting from 'test-app/controllers/helpers-testing';

export default RouteTemplate<{
  Args: { model: unknown; controller: HelpersTesting };
}>(
  <template>
    <h1>Helpers testing</h1>
    <div class="select-choose">
      <PowerSelect
        @options={{@controller.numbers}}
        @selected={{@controller.selected}}
        @onChange={{fn (mut @controller.selected)}}
        as |num|
      >
        {{num}}
      </PowerSelect>
    </div>

    <div class="select-choose-onopen">
      <PowerSelect
        @onOpen={{@controller.onOpenHandle}}
        @options={{@controller.optionz}}
        @selected={{@controller.selected}}
        @onChange={{fn (mut @controller.selected)}}
        @allowClear={{true}}
        as |num|
      >
        {{num}}
      </PowerSelect>
    </div>

    <div class="select-choose-onopen-multiple">
      <PowerSelectMultiple
        @onOpen={{@controller.onOpenHandle}}
        @options={{@controller.optionz}}
        @selected={{@controller.selected2Multi}}
        @onChange={{fn (mut @controller.selected2Multi)}}
        as |num|
      >
        {{num}}
      </PowerSelectMultiple>
    </div>

    <div>
      <PowerSelect
        @triggerClass="select-with-class-in-trigger"
        @options={{@controller.numbers}}
        @selected={{@controller.selected}}
        @onChange={{fn (mut @controller.selected)}}
        @searchEnabled={{true}}
        as |num|
      >
        {{num}}
      </PowerSelect>
    </div>

    {{#if @controller.selected}}
      <span class="select-choose-target">You've selected:
        {{@controller.selected}}</span>
    {{/if}}

    <div class="select-async">
      <PowerSelect
        @selected={{@controller.selected}}
        @onChange={{fn (mut @controller.selected)}}
        @search={{@controller.searchAsync}}
        @searchEnabled={{true}}
        as |num|
      >
        {{num}}
      </PowerSelect>
    </div>

    <div class="select-multiple">
      <PowerSelectMultiple
        @options={{@controller.numbers}}
        @selected={{@controller.selectedList}}
        @onChange={{fn (mut @controller.selectedList)}}
        @searchEnabled={{true}}
        as |num|
      >
        {{num}}
      </PowerSelectMultiple>
    </div>

    <div id="select-multiple-async">
      <PowerSelectMultiple
        @options={{@controller.numbers}}
        @selected={{@controller.asyncSelectedList}}
        @onChange={{fn @controller.onChangeAsyncMultiple "asyncSelectedList"}}
        as |num|
      >
        {{num}}
      </PowerSelectMultiple>
    </div>

    <div class="select-deselect-async">
      <PowerSelect
        @options={{@controller.numbers}}
        @selected={{@controller.asyncSelected}}
        @onChange={{fn @controller.onChangeAsync "asyncSelected"}}
        @allowClear={{true}}
        as |num|
      >
        {{num}}
      </PowerSelect>
    </div>

    <h2 class="t3">Customized component</h2>
    <div class="select-custom-search">
      <PowerSelect
        @selected={{@controller.selected3}}
        @onChange={{fn (mut @controller.selected3)}}
        @search={{@controller.searchAsync}}
        @triggerComponent={{component CustomTriggerWithSearch}}
        as |num|
      >
        {{num}}
      </PowerSelect>
    </div>
  </template>,
);
