import fastifyPlugin from "fastify-plugin";
import fastifyCors from "@fastify/cors";

export default fastifyPlugin(async function (fastify, _, next) {
  fastify.register(fastifyCors, {
    origin: true,
  });
  next();
});
