declare module 'ember-power-select/test-support' {
  export function selectChoose(
    cssPathOrTrigger: HTMLElement | string,
    valueOrSelector: string,
    optionIndex?: number
  ): Promise<void>;
  export function selectSearch(
    cssPathOrTrigger: HTMLElement | string,
    value: string
  ): Promise<void>;
}
