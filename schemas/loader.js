const fp = require('fastify-plugin') 
module.exports = fp(function(fastify, options, next){
  fastify.addSchema(require('./user-input-headers.json'));
  fastify.addSchema(require('./dotenv.json'));
  next();
});
