/* eslint-env node, mocha */
'use strict';

const blueprintHelpers = require('ember-cli-blueprint-test-helpers/helpers');
const setupTestHooks = blueprintHelpers.setupTestHooks;
const emberNew = blueprintHelpers.emberNew;
const emberGenerate = blueprintHelpers.emberGenerate;
const modifyPackages = blueprintHelpers.modifyPackages;

const chai = require('ember-cli-blueprint-test-helpers/chai');
const file = chai.file;
const expect = chai.expect;

const fs = require('fs');
const path = require('path');

function createStyleFixture(name) {
  let stylePath = path.join('app', 'styles');
  if (!fs.existsSync(stylePath)) {
    fs.mkdirSync(stylePath);
  }
  fs.writeFileSync(path.join(stylePath, name), 'body { color: red; }');
}

describe('Acceptance: ember generate ember-power-select', function() {
  setupTestHooks(this);

  it('skips blueprint when no preprocessor present', function() {
    let args = ['ember-power-select'];

    // pass any additional command line options in the arguments array
    return emberNew()
      .then(() => emberGenerate(args, (file) => {
        expect(file('app/styles/app.scss')).to.not.exist;
        expect(file('app/styles/app.less')).to.not.exist;
      }));
  });

  it('creates app.scss if not existing', function() {
    let args = ['ember-power-select'];

    // pass any additional command line options in the arguments array
    return emberNew()
      .then(() => modifyPackages([
        { name: 'ember-cli-sass' }
      ]))
      .then(() => emberGenerate(args))
      .then(() => {
        expect(file('app/styles/app.scss'))
          .to.contain('@import "ember-power-select";');
        expect(file('app/styles/app.less')).to.not.exist;
      });
  });

  it('adds @import to existing app.scss', function() {
    let args = ['ember-power-select'];

    // pass any additional command line options in the arguments array
    return emberNew()
      .then(() => modifyPackages([
        { name: 'ember-cli-sass' }
      ]))
      .then(() => createStyleFixture('app.scss'))
      .then(() => emberGenerate(args, (file) => {
        expect(file('app/styles/app.scss')).to.contain('@import "ember-power-select";');
        expect(file('app/styles/app.less')).to.not.exist;
      }));
  });

  it('creates app.less if not existing', function() {
    let args = ['ember-power-select'];

    // pass any additional command line options in the arguments array
    return emberNew()
      .then(() => modifyPackages([
        { name: 'ember-cli-less' }
      ]))
      .then(() => emberGenerate(args))
      .then(() => {
        expect(file('app/styles/app.less'))
          .to.contain('@import "ember-power-select";');
        expect(file('app/styles/app.scss')).to.not.exist;
      });
  });

  it('adds @import to existing app.less', function() {
    let args = ['ember-power-select'];

    // pass any additional command line options in the arguments array
    return emberNew()
      .then(() => modifyPackages([
        { name: 'ember-cli-less' }
      ]))
      .then(() => createStyleFixture('app.less'))
      .then(() => emberGenerate(args))
      .then(() => {
        expect(file('app/styles/app.less'))
          .to.contain('body { color: red; }')
          .to.contain('@import "ember-power-select";');
        expect(file('app/styles/app.scss')).to.not.exist;
      });
  });
});
