// import { module, test } from 'qunit';
// import { setupRenderingTest } from '../../../helpers';
// import {
//   render,
//   settled,
//   click,
//   waitFor,
//   type TestContext,
// } from '@ember/test-helpers';
// import {
//   typeInSearch,
//   clickTrigger,
// } from '#src/test-support/helpers';
// import { setupMirage } from 'ember-cli-mirage/test-support';
// import type Store from '@ember-data/store';
// import type UserModel from '../../../../demo-app/models/user';
// import type { Selected } from '#src/types';
// import PowerSelect from '#src/components/power-select';
// import PowerSelectMultiple from '#src/components/power-select-multiple';
// import { fn } from '@ember/helper';

// interface UsersContext<IsMultiple extends boolean = false> extends TestContext {
//   store: Store;
//   server: {
//     createList: (model: string, timing: number) => void;
//     timing: number;
//   };
//   users: UserModel[] | Promise<UserModel[]>;
//   search: () => Promise<UserModel[]>;
//   selected: Selected<UserModel, IsMultiple>;
//   foo: (selection: Selected<UserModel, IsMultiple>) => void;
// }

// module(
//   'Integration | Component | Ember Power Select (Ember-data integration)',
//   function (hooks) {
//     setupRenderingTest(hooks);
//     setupMirage(hooks);

//     hooks.beforeEach(function (this: UsersContext) {
//       const owner = this.owner;
//       this.store = owner.lookup('service:store') as Store;
//     });

//     test<UsersContext>('Passing as options of a `store.findAll` works', async function (assert) {
//       const self = this;

//       this.server.createList('user', 10);
//       this.server.timing = 200;
//       this.users = Promise.resolve([]);
//       await this.users;
//       this.foo = () => {};
//       await render<UsersContext>(
//         <template>
//           <PowerSelect
//             @options={{self.users}}
//             @searchField="name"
//             @onChange={{self.foo}}
//             @searchEnabled={{true}}
//             as |option|
//           >
//             {{option.name}}
//           </PowerSelect>
//         </template>,
//       );

//       void this.set('users', this.store.findAll('user'));
//       const promise = clickTrigger();
//       await waitFor('.ember-power-select-option');
//       assert
//         .dom('.ember-power-select-option')
//         .hasText(
//           'Loading options...',
//           'The loading message appears while the promise is pending',
//         );
//       await promise;
//       await this.users;
//       await settled();
//       assert
//         .dom('.ember-power-select-option')
//         .exists(
//           { count: 10 },
//           'Once the collection resolves the options render normally',
//         );
//       await typeInSearch('2');
//       assert
//         .dom('.ember-power-select-option')
//         .exists({ count: 1 }, 'Filtering works');
//     });

//     test<UsersContext>('Passing as options the result of `store.query` works', async function (assert) {
//       const self = this;

//       this.server.createList('user', 10);
//       this.server.timing = 200;
//       this.users = Promise.resolve([]);
//       await this.users;
//       this.foo = () => {};
//       await render<UsersContext>(
//         <template>
//           <PowerSelect
//             @options={{self.users}}
//             @searchField="name"
//             @onChange={{self.foo}}
//             @searchEnabled={{true}}
//             as |option|
//           >
//             {{option.name}}
//           </PowerSelect>
//         </template>,
//       );

//       void this.set('users', this.store.query('user', { foo: 'bar' }));
//       const promise = clickTrigger();
//       await waitFor('.ember-power-select-option');
//       assert
//         .dom('.ember-power-select-option')
//         .hasText(
//           'Loading options...',
//           'The loading message appears while the promise is pending',
//         );
//       await promise;
//       await this.users;
//       await settled();
//       assert
//         .dom('.ember-power-select-option')
//         .exists(
//           { count: 10 },
//           'Once the collection resolves the options render normally',
//         );
//       await typeInSearch('2');
//       assert
//         .dom('.ember-power-select-option')
//         .exists({ count: 1 }, 'Filtering works');
//     });

//     test<
//       UsersContext<true>
//     >('Delete an item in a multiple selection', async function (assert) {
//       const self = this;

//       this.server.createList('user', 10);
//       this.users = Promise.resolve([]);
//       await this.users;
//       await render<UsersContext<true>>(
//         <template>
//           <PowerSelectMultiple
//             @options={{self.users}}
//             @searchField="name"
//             @selected={{self.selected}}
//             @onChange={{fn (mut self.selected)}}
//             as |option|
//           >
//             {{option.name}}
//           </PowerSelectMultiple>
//         </template>,
//       );

//       void this.set('users', this.store.findAll('user'));
//       await this.users;
//       void this.set('selected', this.users);
//       await settled();
//       await click('.ember-power-select-multiple-remove-btn');
//       assert
//         .dom('.ember-power-select-multiple-remove-btn')
//         .exists(
//           { count: 9 },
//           'Once the collection resolves the options render normally',
//         );
//     });

//     test<UsersContext>('returning an Ember-data collection from the search works', async function (assert) {
//       const self = this;

//       this.server.createList('user', 10);
//       this.server.timing = 0;
//       this.selected = undefined;
//       this.search = () => {
//         return this.store.findAll('user') as Promise<UserModel[]>;
//       };
//       await render<UsersContext>(
//         <template>
//           <PowerSelect
//             @selected={{self.selected}}
//             @onChange={{fn (mut self.selected)}}
//             @searchEnabled={{true}}
//             @search={{self.search}}
//             as |option|
//           >
//             {{option.name}}
//           </PowerSelect>
//         </template>,
//       );

//       await clickTrigger();
//       await typeInSearch('anything');
//       await settled();
//       await click('.ember-power-select-option:nth-child(4)');
//       assert
//         .dom('.ember-power-select-dropdown')
//         .doesNotExist('Dropdown is rendered');
//       assert
//         .dom('.ember-power-select-trigger')
//         .hasText('User 3', 'The 4th option was selected');
//     });

//     test<
//       UsersContext<true>
//     >('passing an Ember-data collection to `@selected` of a multiple select works', async function (assert) {
//       const self = this;

//       this.server.createList('user', 10);
//       this.server.timing = 0;
//       this.users = this.store.findAll('user') as Promise<UserModel[]>;
//       await this.users;
//       this.selected = await this.users;
//       await render<UsersContext<true>>(
//         <template>
//           <PowerSelectMultiple
//             @selected={{self.selected}}
//             @options={{self.users}}
//             @onChange={{fn (mut self.selected)}}
//             as |option|
//           >
//             {{option.name}}
//           </PowerSelectMultiple>
//         </template>,
//       );
//       assert.dom('.ember-power-select-multiple-option ').exists({ count: 10 });
//       assert
//         .dom('.ember-power-select-multiple-option:nth-child(4)')
//         .containsText('User 3');
//       await clickTrigger();
//       assert.dom('.ember-power-select-option').exists({ count: 10 });
//       await click('.ember-power-select-option:nth-child(4)');
//       assert.dom('.ember-power-select-multiple-option').exists({ count: 9 });
//       assert
//         .dom('.ember-power-select-multiple-option:nth-child(4)')
//         .containsText(
//           'User 4',
//           'The 4th selected option is not User 3 anymore',
//         );
//     });
//   },
// );
