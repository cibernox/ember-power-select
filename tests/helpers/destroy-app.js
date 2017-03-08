import Ember from 'ember';

export default function destroyApp(application) {
  if (server) {
    server.shutdown();
  }
  Ember.run(application, 'destroy');
}
