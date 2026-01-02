import Component from '@glimmer/component';
import { not } from 'ember-truth-helpers';

// @ts-expect-error Public property 'isFastBoot' of exported class
const isFastBoot = typeof FastBoot !== 'undefined';

export default class ShadowRoot extends Component<{
  Element: HTMLDivElement;
  Blocks: { default: [] };
}> {
  get shadowDom() {
    if (this.isFastBoot) {
      return false;
    }

    if (import.meta.env.VITE_SHADOW_DOM_BUILD === 'true') {
      return true;
    }

    return false;
  }

  isFastBoot = isFastBoot;

  get shadowRootElement(): HTMLElement | null | undefined {
    const shadowRoot = document.getElementById('shadow-root')?.shadowRoot;
    const div = document.createElement('div');
    shadowRoot?.appendChild(div);

    return div;
  }

  get getStyles() {
    return [...document.head.querySelectorAll('link')].map((link) => link.href);
  }

  <template>
    {{#if (not this.shadowDom)}}
      {{yield}}
    {{else if this.shadowRootElement}}
      {{#in-element this.shadowRootElement}}
        {{#each this.getStyles as |styleHref|}}
          <link rel="stylesheet" type="text/css" href={{styleHref}} />
        {{/each}}
        {{yield}}
      {{/in-element}}
    {{/if}}
  </template>
}
