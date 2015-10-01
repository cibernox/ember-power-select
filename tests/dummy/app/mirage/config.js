export default function() {
  this.get('/users', function(db) {
    return {
      data: db.users.map(attrs => ({type: 'users', id: attrs.id, attributes: attrs }))
    };
  });
}