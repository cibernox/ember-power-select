import Component from '@glimmer/component';
import { modifier } from 'ember-modifier';
import { htmlSafe, type SafeString } from '@ember/template';
import { tracked } from '@glimmer/tracking';
import { codeToHtml } from 'shiki';
import { task } from 'ember-concurrency';

const files = import.meta.glob('./snippets/*', {
  query: '?raw',
  import: 'default',
}) as Record<string, () => Promise<string>>;

async function loadSnippet(name: string) {
  const path = `./snippets/${name}` as const;
  const loader = files[path];
  if (!loader) throw new Error(`File not found: ${path}`);
  return await loader();
}

interface CodeInlineSignature {
  Element: HTMLElement;
  Args: {
    fileName: string;
    language?: string;
  };
}

export default class CodeInline extends Component<CodeInlineSignature> {
  @tracked prismCode: string | SafeString = '';

  get language() {
    return this.args.language ?? 'markup';
  }

  setup = modifier(() => {
    void this.generateCode.perform();
  });

  generateCode = task(async () => {
    const language = this.language;

    const code = await loadSnippet(this.args.fileName);

    const htmlCode = await codeToHtml(code, {
      lang: language,
      theme: 'github-light-default',
    });

    this.prismCode = htmlSafe(htmlCode);
  });

  <template>
    <div ...attributes {{this.setup}}>
      {{~! ~}}{{this.prismCode}}{{~! ~}}
    </div>
  </template>
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    CodeInline: typeof CodeInline;
  }
}
