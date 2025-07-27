import fastifyPlugin from "fastify-plugin";
import listQuerySchema from "./list-query.json" with {type: "json"};
import createBodySchema from "./create-body.json" with {type: "json"};
import createResponseSchema from "./create-response.json" with {type: "json"};
import statusParamsSchema from "./status-params.json" with {type: "json"};

export default fastifyPlugin(async(fastify) => {
    fastify.addSchema(listQuerySchema);
    fastify.addSchema(createBodySchema);
    fastify.addSchema(statusParamsSchema);
    fastify.addSchema(createResponseSchema);
})
