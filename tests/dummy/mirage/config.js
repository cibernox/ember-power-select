export default function() {

  this.timing = 2000;
  this.get('/users');

  this.passthrough('http://api.github.com/search/repositories');

  this.pretender.get('/*passthrough', this.pretender.passthrough);

}
export function testConfig() {
  this.get('/users');
  this.get('/users/:id');
}
