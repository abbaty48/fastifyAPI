import fastifyPlugin from "fastify-plugin";
import fastifyMongodb from "@fastify/mongodb";

export default fastifyPlugin(async (fastify, options) => {
  fastify.register(fastifyMongodb, fastify.config.mongo);
});
