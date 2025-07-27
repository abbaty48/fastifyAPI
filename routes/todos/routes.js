import fastifyPlugin from "fastify-plugin";

export default async function todoRoutes(fastify, options)  {
  
  fastify
    .get("/", {
      handler: async (req, reply) => {
        return {data: [], totalCount: 0};
      }
    })
    .get("/:id", {
      handler: async (req, reply) => {
        return {};
      }
    })
    .put("/:id", {
      handler: async (req, reply) => {
        reply.code(204);
      }
    })
    .post("/", {
      handler: async (req, reply) => {
        return {id: 123};
      }
    })
    .delete("/:id", {
      handler: async (req, reply) => {
        reply.code(204);
      }
    });

};
