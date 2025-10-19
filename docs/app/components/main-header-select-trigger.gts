import { LinkTo } from '@ember/routing';
import type { TOC } from '@ember/component/template-only';

export interface MainHeaderSelectTriggerSignature {
  Element: Element;
  Args: {
    disabled: boolean;
  };
}

<template>
  {{#if @disabled}}
    <LinkTo @route="public-pages.index">
      <strong>Power</strong>
      Select
      <div class="ember-power-select-status-icon"></div>
    </LinkTo>
  {{else}}
    <strong>Power</strong>
    Select
    <div class="ember-power-select-status-icon"></div>
  {{/if}}
</template> satisfies TOC<MainHeaderSelectTriggerSignature>;
