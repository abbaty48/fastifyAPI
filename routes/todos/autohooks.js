import fastifyPlugin from "fastify-plugin";
import schemas from "./schemas/loader.js";

export default fastifyPlugin(async (fastify) => {
  fastify.register(schemas);
})
