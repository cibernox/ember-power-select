# ember-power-select

[![CI](https://github.com/cibernox/ember-power-select/actions/workflows/ci.yml/badge.svg)](https://github.com/cibernox/ember-power-select/actions/workflows/ci.yml)
[![Ember Observer Score](http://emberobserver.com/badges/ember-power-select.svg)](http://emberobserver.com/addons/ember-power-select)
[![Code Climate](https://codeclimate.com/github/cibernox/ember-power-select/badges/gpa.svg)](https://codeclimate.com/github/cibernox/ember-power-select)
[![npm version](https://badge.fury.io/js/ember-power-select.svg)](https://badge.fury.io/js/ember-power-select)

Ember Power Select is a select component written in Ember with a focus in flexibility and extensibility.

It is designed to work well with the way we build Ember apps, so it plays nicely with promises, ember-concurrency's tasks,
ember-data collections and follows idiomatic patterns.

## Compatibility

* Ember.js v3.28 or above
* Ember CLI v3.28 or above

Version 1.X works in Ember **2.3.1+**, beta and canary with no deprecations
whatsoever. Any deprecation will be considered a bug.

Version 2.X requires Ember **2.10.0+**.

Version 3.X requires Ember **3.11.0+**.

Version 4.X requires Ember **3.13.0+**.

Version 5.X & 6.X requires Ember **3.16.0+**.

Version 7.X & 8.X requires Ember **3.28.0+**.

## Installation

```
ember install ember-power-select
```

For more installation details see [documentation](https://ember-power-select.com/docs/installation)

## Features overview

Ember Power Select wants to be as agnostic as possible about how you're going to use it, but it still provides
some default implementations that will match 95% of your needs, and exposes actions to customize the other
5% of usages.

Features include:

* Single select
* Multiple select
* HTML inside the options or the trigger.
* Filter options sanitizing diacritics.
* Custom matchers.
* Asynchonous searches.
* Theming
* Fully promise-aware, with loading states.
* Compatible with ember-concurrency task cancellation.
* Compatibility with ember-data's ArrayProxies
* Groups (with not deep limit), placeholders...
* Clear the selection
* Disable the component or individual options
* CSS animations and transitions
* ... and anything else you want. Just replace parts of the selects with your own components.

## Usage

Check the full documentation with live examples at [www.ember-power-select.com](http://www.ember-power-select.com) and
please open an issue if something doesn't work or is not clear enough.

Good docs are important :)

## Extensions

Ember-power-select's focus on flexibility enables the community to build richer and more tailor made
components on top of it, focused in solving one particular problem, using composition.

Check the [addons](http://www.ember-power-select.com/addons) section to see some and if you create
one that you want to open source open a PR to include it in the list.

## Browser support

This addon was tested in modern browsers and there is no technical reason it
wouldn't work. If you find a problem please file an issue.

## Testing

In testing it requires ember-cli-qunit. This component also provides some convenient [test helpers](http://www.ember-power-select.com/docs/test-helpers)
to interact with the component in acceptance tests.

## Contributing

Any contribution is welcome. Please read our [guidelines](CONTRIBUTING.md).
However, if your contribution involves adding a new feature, please open an issue before to
share your plan and agree the details of the feature before starting implementing it.

## Troubleshooting

If something doesn't work visit the [Troubleshooting](http://www.ember-power-select.com/docs/troubleshooting)
section of the docs first and if your problem persist open an issue, specify the version of the component,
Ember and browser.

