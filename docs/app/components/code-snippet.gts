// @ts-expect-error Could not find a declaration file for module 'ember-code-snippet'.
import getCodeSnippet from 'ember-code-snippet/helpers/get-code-snippet';
import CodeBlock from './code-block';
import type { TOC } from '@ember/component/template-only';

export interface CodeSnippetSignature {
  Element: Element;
  Args: {
    name: string;
  };
}

<template>
  {{#let (getCodeSnippet @name) as |snippet|}}
    <CodeBlock @language={{snippet.language}} @code={{snippet.source}} />
  {{/let}}
</template> satisfies TOC<CodeSnippetSignature>;
