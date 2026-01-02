import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { modifier } from 'ember-modifier';
import BasicDropdownWormhole from 'ember-basic-dropdown/components/basic-dropdown-wormhole';

const shadowRootBuild = import.meta.env.VITE_SHADOW_DOM_BUILD === 'true';

export default class HostWrapper extends Component<{
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
      let shadowRoot = element;
      if (shadowRootBuild) {
        shadowRoot = element.attachShadow({
          mode: 'open',
        }) as unknown as Element;
      }
      const div = document.createElement('div');
      shadowRoot.appendChild(div);
      set(div);
    },
  );
  <template>
    <div
      data-host-wrapper
      {{this.attachShadow this.setShadow}}
      ...attributes
    ></div>

    {{#if this.shadow}}
      {{#in-element this.shadow}}
        {{#if shadowRootBuild}}
          {{#each this.getStyles as |styleHref|}}
            <link rel="stylesheet" type="text/css" href={{styleHref}} />
          {{/each}}
          <BasicDropdownWormhole />
        {{/if}}
        {{yield}}
      {{/in-element}}
    {{/if}}
  </template>
}
