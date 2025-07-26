const fp = require('fastify-plugin') 
module.exports = fp(function(fastify, optins, next){
  fastify.addSchema(require('./user-input-headers.json'));
  next();
});
