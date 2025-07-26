import fastifySwagger from "@fastify/swagger";
import fastifyPlugin from "fastify-plugin";

export default fastifyPlugin(async function (fastify) {
  fastify.register(fastifySwagger, {
    routePrefix: "/docs",
    exposeRoute: fastify.secrets.NODE_ENV !== "production",
    swagger: {
      info: {
        title: "Fastify app",
        description: "Fastify Book Examples",
        version: process.version,
      },
    },
  });
});
