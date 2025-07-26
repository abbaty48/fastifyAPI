import fastifyPlugin from "fastify-plugin";
import dotEnvSchema from "./dotenv.schemas.json" with { type: "json" };

export default fastifyPlugin(async function (fastify) {
  fastify.addSchema(dotEnvSchema);
});
