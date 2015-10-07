/* global require, module */
var sass = require('node-sass');
var fs = require('fs');
var path = require('path');

var inputFile = path.join(__dirname, 'app', 'styles', 'ember-power-select.scss');
var outputFile = path.join(__dirname, 'vendor', 'ember-power-select.css');
var buf = fs.readFileSync(inputFile, "utf8");
var result = sass.renderSync({
  data: buf,
  includePaths: ['node_modules/ember-basic-dropdown/app/styles/']
});

fs.writeFileSync(outputFile, result.css);
