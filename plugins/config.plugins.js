import fastifyEnv from "@fastify/env";
import fastifyPlugin from "fastify-plugin";

export default fastifyPlugin(async function (fastify) {
  (
    await fastify.register(fastifyEnv, {
      confKey: "secrets",
      schema: fastify.getSchema("schema:dotenv"),
    })
  ).decorate("config", {
    mongo: {
      forceClose: true,
      url: fastify.secrets.mongo,
    },
  });
});
