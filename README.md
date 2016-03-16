[![Build Status](https://travis-ci.org/cibernox/ember-power-select.svg?branch=master)](https://travis-ci.org/cibernox/ember-power-select)
[![Ember Observer Score](http://emberobserver.com/badges/ember-power-select.svg)](http://emberobserver.com/addons/ember-power-select)
[![Code Climate](https://codeclimate.com/github/cibernox/ember-power-select/badges/gpa.svg)](https://codeclimate.com/github/cibernox/ember-power-select)
[![npm version](https://badge.fury.io/js/ember-power-select.svg)](https://badge.fury.io/js/ember-power-select)

# Ember-Power-Select

Ember Power Select is an pure ember select component focused in flexibility and extensibility.

## Installation

Ember Power Select works in Ember **1.13.9+** or **2.0+**, including beta and canary, with no deprecations
whatsoever. Any deprecation will be considered a bug.

As any other ember-cli addon, run:

```
ember install ember-power-select
```

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
* Compatibility with ember-data's ArrayProxies
* Groups (with not deep limit), placeholders...
* Clear the selection
* Disable the component or individual options
* CSS animations and transitions [in beta]
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

This component was just tested it in modern browsers but there is no technical reason it
wouldn't work in IE9+. If you find any problem please file an issue.

## Testing

In testing it requires phantomjs 2.0+. This component also provides some convenient [test helpers](http://www.ember-power-select.com/docs/test-helpers)
to interact with the component in acceptance tests.

## Contributing

Any contribution is welcome. Please read our [guidelines](CONTRIBUTING.md).

## Troubleshooting

If something doesn't work visit the [Troubleshooting](http://www.ember-power-select.com/docs/troubleshooting)
section of the docs first and if your problem persist open an issue, specify the version of the component,
Ember and browser.

