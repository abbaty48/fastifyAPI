const fs = require("fastify-plugin");

module.exports = fs(
  async function (fastify, opts) {
    fastify.register(require("@fastify/swagger"), {
      routePrefix: "/docs",
      exposeRoute: fastify.secrets.NODE_ENV !== "production",
      swagger: {
        info: {
          title: "Fastify app",
          description: "Fastify Book Examples",
          version: require("../package.json").version,
        },
      },
    });
  },
  { dependencies: ["application-config"] },
);
