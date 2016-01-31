export default function() {

  this.timing = 4000;
  this.get('/users');

  this.passthrough('http://api.github.com/search/repositories');

  this.pretender.get('/*passthrough', this.pretender.passthrough);

}
