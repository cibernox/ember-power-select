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

In testing it requires phantomjs 2.0+. This component also provides some convenient [test helpers](www.ember-power-select.com/docs/test-helpers)
to interact with the component in acceptance tests.

## Troubleshooting

If something doesn't work visit the [Troubleshooting](http://www.ember-power-select.com/docs/troubleshooting)
section of the docs first and if your problem persist open an issue.

## Motivation

> Why reinvent the wheel when there are already good framework-agnostic libraries out there that are
battle tested and can be wrapped?

> — Your brain, now.

Believe me, I tried. And it worked for a while. Two good ember examples of addons doing that are
[ember-cli-selectize](https://github.com/miguelcobain/ember-cli-selectize) and [https://github.com/iStefo/ember-select-2](ember-select-2).

However this approach has inherent downsides.

By accepting to use a framework agnostic library one needs to renounce to take advantage of the more higher
level primitives that Ember and HTMLBars provide.

Let's say that you need to build a mildly complex select which, as you type in a search-box,
shows you a list of users that match that search with their avatars, names, and other information,
and if there is no match it shows some message. When you select one user you navigate to the user profile.

Using components and blocks this can be expressed very naturally.

```hbs
{{#my-select search=(action "findUsers") onchange=(action "seeProfile") as |user|}}
  <img src="{{user.avatarUrl}}" alt="{{t 'alts.avatar-of' user=user.fullName}}">
  <strong>{{user.fullName}}</strong>
  <em>{{user.email}}</em>
{{else}}
  <img src="sad-face.svg">
  <p>{{t "users.sorry-no-matches-try-again"}}</p>
{{/my-select}}
```

This is the kind of expressiveness I wanted to find but is actually not possible to achieve translating between
the "Ember world" where we solve problems in terms of actions and templates and the lower level world
of those libraries where things are expressed in terms of events and DOM nodes.

Even for things that are not impossible to do, translating between the bindings and data structures we use in
ember and those in the libraries requires a surprising amount of glue code and is a very tricky task.

Also those libraries tend to be quite complex and bloated with functionality not directly related with
the task they have to solve, like internationalization for example. We don't need that code making this
libraries weight ~100KB when we already have better and more natural ways to do it already.

I thought that we deserved a select component for ember projects built with from scratch with ember in mind.
That also allowed this library to weight <10KB (JS + CSS + images) when gzipped.
