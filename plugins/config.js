const fp = require('fastify-plugin');
const fe = require('@fastify/env');

module.exports = fp(async function(fastify, options) {
  await fastify.register(fe, {
    confKey: "secrets",
    schema: fastify.getSchema('schema:dotenv')
  });
  
  fastify.decorate('config', {
    mongo: {
      forceClose: true,
      url: fastify.secrets.MONGO_URL
    }
  })
});
