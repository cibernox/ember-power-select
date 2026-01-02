// import { discoverEmberDataModels } from 'ember-cli-mirage';
// import { createServer } from 'miragejs';

// export default function (config) {
//   let finalConfig = {
//     ...config,
//     models: {
//       ...discoverEmberDataModels(config.store),
//       ...config.models,
//     },
//     routes,
//   };

//   return createServer(finalConfig);
// }

// function routes() {
//   this.timing = 2000;
//   this.get('/users');

//   this.passthrough('http://api.github.com/search/repositories');

//   this.pretender.get('/*passthrough', this.pretender.passthrough);
// }
