const fp = require('fastify-plugin');
const fe = require('@fastify/env');
 
module.exports = fp(function(fastify, options, next) {
  fastify.register(fe, {
    confKey: "secrets",
    schema: fastify.getSchema('schema:dotenv')
  });
  next();<F11>
}, {name: 'application-config'});
