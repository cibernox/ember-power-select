function readPackage(pkg, context) {
  if (pkg.name === 'ember-basic-dropdown') {
    delete pkg.peerDependencies['@embroider/macros'];
    delete pkg.devDependencies['@embroider/macros'];

    context.log('ember-basic-dropdown - @embroider/macros removed');
  }

  return pkg
}

module.exports = {
  hooks: {
    readPackage
  }
}
