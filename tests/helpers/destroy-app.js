import { run } from '@ember/runloop';

export default function destroyApp(application) {
  if (server) {
    server.shutdown();
  }
  run(application, 'destroy');
}
