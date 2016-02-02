var expect  = require('chai').expect;
var RSVP    = require('rsvp');
var request = RSVP.denodeify(require('request'));

describe('simple acceptance', function() {
  return request('http://localhost:3000').then(function(response) {
    // console.log('basic test!!');
    // console.log('basic test!!');
    // console.log('basic test!!');
    // console.log('basic test!!');
    console.log('response.statusCode');
    console.log(response.statusCode);
    console.log('response.body');
    console.log(response.body);
    // parse and assert over the body
  });
});