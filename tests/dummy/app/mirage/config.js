export default function() {

  this.timing = 4000;
  this.get('/users', function(db) {
    return {
      data: db.users.map(attrs => ({type: 'users', id: attrs.id, attributes: attrs }))
    };
  });

  
  this.passthrough('http://api.github.com/search/repositories');
  
}