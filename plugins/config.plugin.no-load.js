import fastifyEnv from "@fastify/env";
import fastifyPlugin from "fastify-plugin";

export const envSchema = {
  type: "object",
  required: ["MONGO_URL", "JWT_TOKEN"],
  properties: {
    JWT_TOKEN: { type: "string" },
    MONGO_URL: { type: "string" },
    JWT_EXPIRE_IN: { type: "string" },
    PORT: { type: "number", default: 3000 },
    NODE_ENV: { type: "string", default: "development" },
  },
};

export default fastifyPlugin(async function (fastify, _, next) {
  await fastify.register(fastifyEnv, {
    confKey: "secrets",
    schema: envSchema,
    data: process.env,
  });
  fastify.decorate("config", {
    mongo: {
      forceClose: true,
      url: fastify.secrets.MONGO_URL,
    },
  });
});
