import templateOnly from '@ember/component/template-only';

export interface CodeSnippetSignature {
  Element: Element;
  Args: {
    name: string;
  };
}

export default templateOnly<CodeSnippetSignature>();
