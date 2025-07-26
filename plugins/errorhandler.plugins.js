import fastifyPlugin from "fastify-plugin";

export default fastifyPlugin(async function (fastify) {
  fastify.setErrorHandler((err, req, reply) => {
    if (err.statusCode >= 500) {
      req.log.error({ req, res: reply, err }, err?.message);
      reply.send(`Fatal error, contact the support team. Id ${req.id}`);
      return;
    }
    req.log.error({ req, res: reply, err }, err?.message);
    reply.send(err);
  });
});
