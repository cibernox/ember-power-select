module.exports = function(deployTarget) {  
  return {
    pagefront: {
      app: 'ember-power-select',
      key: process.env.PAGEFRONT_KEY
    }
  };
};
