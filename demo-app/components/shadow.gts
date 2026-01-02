import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { modifier } from 'ember-modifier';

export default class Shadow extends Component<{
  Element: HTMLDivElement;
  Blocks: { default: [] };
}> {
  @tracked shadow: Element | undefined;

  setShadow = (shadowRoot: HTMLDivElement) => {
    this.shadow = shadowRoot;
  };

  get getStyles() {
    return [...document.head.querySelectorAll('link')].map((link) => link.href);
  }

  attachShadow = modifier(
    (element: Element, [set]: [(shadowRoot: HTMLDivElement) => void]) => {
      const shadowRoot = element.attachShadow({ mode: 'open' });
      const div = document.createElement('div');
      shadowRoot.appendChild(div);
      set(div);
    },
  );
  <template>
    <div data-shadow {{this.attachShadow this.setShadow}} ...attributes></div>

    {{#if this.shadow}}
      {{#in-element this.shadow}}
        {{#each this.getStyles as |styleHref|}}
          <link rel="stylesheet" type="text/css" href={{styleHref}} />
        {{/each}}
        {{yield}}
      {{/in-element}}
    {{/if}}
  </template>
}
