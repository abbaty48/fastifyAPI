import fastifyPlugin from "fastify-plugin";
import fastifyCors from "@fastify/cors";

export default fastifyPlugin(async function (fastify) {
  fastify.register(fastifyCors, {
    origin: true,
  });
});
