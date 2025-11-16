import Component from '@glimmer/component';
import { getOwner } from '@ember/application';

// @ts-expect-error Public property 'isFastBoot' of exported class
const isFastBoot = typeof FastBoot !== 'undefined';

export default class ShadowRootComponent extends Component<{
  Element: HTMLDivElement;
  Blocks: { default: [] };
}> {
  get shadowDom() {
    if (this.isFastBoot) {
      return false;
    }

    const config = (
      getOwner(this) as unknown as {
        resolveRegistration: (key: string) => {
          APP: {
            shadowDom: boolean;
          };
        };
      }
    ).resolveRegistration('config:environment');

    return config.APP.shadowDom ?? false;
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
}
