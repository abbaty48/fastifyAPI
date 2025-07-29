import fastifyPlugin from "fastify-plugin";
import dotEnvSchema from "./dotenv.schemas.json" with { type: "json" };
import authTokenHeaderSchema from "./auth_token_header.schemas.json" with { type: "json" };
import authTokenSchema from "./auth_token.schemas.json" with { type: "json" };
import authRegisterSchema from "./auth_register.schemas.json" with { type: "json" };
import todoListQuerySchema from "./todo_list_query.schemas.json" with { type: "json" };
import todoCreateBodySchema from "./todo_create_body.schemas.json" with { type: "json" };
import todoCreateResponseSchema from "./todo_create_response.json" with { type: "json" };
import todoStatusParamsSchema from "./todo_status_params.schema.json" with { type: "json" };

export default fastifyPlugin(async function (fastify) {
  fastify.addSchema(dotEnvSchema);
  fastify.addSchema(authTokenSchema);
  fastify.addSchema(authRegisterSchema);
  fastify.addSchema(authTokenHeaderSchema);
  fastify.addSchema(todoListQuerySchema);
  fastify.addSchema(todoCreateBodySchema);
  fastify.addSchema(todoStatusParamsSchema);
  fastify.addSchema(todoCreateResponseSchema);
});
