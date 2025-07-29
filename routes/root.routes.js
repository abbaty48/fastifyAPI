"use strict";
import fastifyPlugin from "fastify-plugin";

export default fastifyPlugin(async (fastify) => {
  fastify.get("/", async function (request, reply) {
    return { root: true };
  });
});
