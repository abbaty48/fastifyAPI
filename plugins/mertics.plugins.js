import Fastify from "fastify";
import fastifyPlugin from "fastify-plugin";
import fastifyMetrics from "fastify-metrics";


export default fastifyPlugin(async (fastify) => {
  fastify.register(fastifyMetrics, {
    defaultMetrics: {enabled: true},
    endpoint: null,
    name: 'Metrics',
    routeMetrics: {enabled: true}
  });

  const promServer = Fastify({logger: app.log});
  promServer.route({
    method: 'GET',
    url: '/metrics',
    logLevel: 'info',
    handler: async (_, reply) => {
      reply.type('text/plain');
      return app.metrics.client.register.metrics()
    }
  });

  fastify.addHook('onClose', async _ => {
    await promServer.close()
  });

  promServer.listen({port: 9001, host: '0.0.0.0'}, {name: 'prom'});

})
