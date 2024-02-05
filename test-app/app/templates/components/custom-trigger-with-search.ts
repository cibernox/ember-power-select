import templateOnly from '@ember/component/template-only';

export interface CustomTriggerWithSearchSignature {
  Element: Element;
  Args: {
    selected: any;
    select: any;
    listboxId: string;
    lastSearchedText: string;
  },
  Blocks: {
    default: [selected: any, lastSearchedText: string ]
  }
}

export default templateOnly<CustomTriggerWithSearchSignature>();
