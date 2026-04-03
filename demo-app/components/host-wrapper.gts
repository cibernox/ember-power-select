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

  attachShadow = modifier(
    (element: Element, [set]: [(shadowRoot: HTMLDivElement) => void]) => {
      let shadowRoot: Element | ShadowRoot = element;
      if (shadowRootBuild) {
        const sr = element.attachShadow({ mode: 'open' });
        // Apply document stylesheets synchronously via Constructable Stylesheets
        // so that layout (offsetHeight, offsetTop) is correct immediately when
        // modifiers fire — avoiding the async <link> race condition.
        sr.adoptedStyleSheets = [...document.styleSheets].reduce<
          CSSStyleSheet[]
        >((acc, sheet) => {
          try {
            const cs = new CSSStyleSheet();
            cs.replaceSync(
              [...sheet.cssRules].map((r) => r.cssText).join('\n'),
            );
            acc.push(cs);
          } catch {
            // Skip cross-origin stylesheets whose rules are inaccessible
          }
          return acc;
        }, []);
        shadowRoot = sr;
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
          <BasicDropdownWormhole />
        {{/if}}
        {{yield}}
      {{/in-element}}
    {{/if}}
  </template>
}
