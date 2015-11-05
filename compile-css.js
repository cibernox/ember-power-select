/* global require, module */
var sass = require('node-sass');
var fs = require('fs');
var path = require('path');

var inputFile = path.join(__dirname, 'app', 'styles', 'ember-power-select.scss');
var outputFile = path.join(__dirname, 'vendor', 'ember-power-select.css');
var themesFolder = path.join(__dirname, 'app', 'styles', 'ember-power-select', 'themes');
var buf = fs.readFileSync(inputFile, "utf8");

// Compile main file
var result = sass.renderSync({
  data: buf,
  includePaths: ['app/styles', 'node_modules/ember-basic-dropdown/app/styles/']
});

fs.writeFileSync(outputFile, result.css);

// Compile themified versions
var themes = fs.readdirSync(themesFolder);
themes.forEach(function(theme) {
  var parts = theme.split('.');
  var out = sass.renderSync({
    data: "@import 'app/styles/ember-power-select/themes/" + parts[0] + "';" + buf,
    includePaths: ['app/styles', 'node_modules/ember-basic-dropdown/app/styles/']
  });
  var destinationFile = path.join(__dirname, 'vendor', 'ember-power-select-' + parts[0] + '.css');
  fs.writeFileSync(destinationFile, out.css);
});
