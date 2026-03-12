import { module, test } from 'qunit';
import { setupRenderingTest } from '../../../helpers';
import { render } from '@ember/test-helpers';
import PowerSelectOptionsComponent from '#src/components/power-select/options.gts';
import PowerSelectBeforeOptionsComponent from '#src/components/power-select/before-options.gts';
import PowerSelect from '#src/components/power-select.gts';
import Component from '@glimmer/component';
import { fn } from '@ember/helper';

interface Dog {
  name: string;
  breed: string;
}

// Real-world pattern: a custom options component (e.g. virtual scrolling)
// that is reused across PowerSelects with different option types.
// T must be unknown because the component doesn't know what it will render.
class VirtualOptions extends PowerSelectOptionsComponent<unknown> {}

// Same pattern for before-options: a custom search UI that doesn't care about T.
// No explicit type arg needed — the default is already `unknown`.
class CustomBeforeOptions extends PowerSelectBeforeOptionsComponent {}

class MyComponent extends Component {
  dogs: Dog[] = [
    { name: 'Rex', breed: 'German Shepherd' },
    { name: 'Lassie', breed: 'Collie' },
  ];
  selected: Dog | undefined = undefined;

  // Without fix: T is poisoned to unknown by @optionsComponent,
  // so {{dog.name}} in the block fails with "Property 'name' does not
  // exist on type '{}'". The entire PowerSelect loses type inference.
  //
  // With fix: NoInfer<T> prevents inference poisoning, and the union
  // type on optionsComponent accepts ComponentLike<Sig<unknown>>.
  // T is inferred from @options as Dog, so {{dog.name}} works.
  <template>
    <PowerSelect
      @options={{this.dogs}}
      @selected={{this.selected}}
      @onChange={{fn (mut this.selected)}}
      @optionsComponent={{VirtualOptions}}
      as |dog|
    >
      {{dog.name}}
    </PowerSelect>
  </template>
}

// Verify the fix works for non-options overrides too.
// All overridable component props use the same NoInfer<T> + union pattern.
class MyComponentWithBeforeOptions extends Component {
  dogs: Dog[] = [
    { name: 'Rex', breed: 'German Shepherd' },
    { name: 'Lassie', breed: 'Collie' },
  ];
  selected: Dog | undefined = undefined;

  <template>
    <PowerSelect
      @options={{this.dogs}}
      @selected={{this.selected}}
      @onChange={{fn (mut this.selected)}}
      @beforeOptionsComponent={{CustomBeforeOptions}}
      as |dog|
    >
      {{dog.name}}
    </PowerSelect>
  </template>
}

module(
  'Integration | Component | Ember Power Select (Type tests - options component type variance)',
  function (hooks) {
    setupRenderingTest(hooks);

    test('Custom options component with T=unknown preserves block yield types', async function (assert) {
      await render(<template><MyComponent /></template>);
      assert.ok(true, 'Renders with correct type inference');
    });

    test('Custom before-options component with T=unknown preserves block yield types', async function (assert) {
      await render(<template><MyComponentWithBeforeOptions /></template>);
      assert.ok(true, 'Renders with correct type inference');
    });
  },
);
