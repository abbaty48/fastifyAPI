export default async function todoRoutes(fastify) {
  fastify.addHook("onRequest", fastify.authenticate);
  const todosCollection = fastify.mongo.db.collection("todos");

  fastify
    .get("/", {
      schema: { query: fastify.getSchema("schema:todo:list:query") },
      handler: async (req, reply) => {
        const { sort, limit, title } = req.query;
        const filter = title ? { title: new RegExp(title, "i") } : {};
        filter.userId = req.user.id;
        const data = await todosCollection
          .find(filter, { sort, limit })
          .toArray();
        const totalCount = await todosCollection.countDocuments(filter);

        return { data, totalCount };
      },
    })
    .get("/:id", {
      handler: async (req, reply) => {
        const todo = await todosCollection.findOne(
          {
            _id: new fastify.mongo.ObjectId(req.params.id),
            userId: req.user.id,
          },
          { projection: { _id: 0 } },
        );

        if (!todo) {
          return reply.code(404).send({ error: "Todo not found." });
        }
        return todo;
      },
    })
    .put("/:id", {
      handler: async (req, reply) => {
        const { modifiedCount } = await todosCollection.updateOne(
          {
            _id: new fastify.mongo.ObjectId(req.params.id),
            userId: req.user.id,
          },
          { $set: { ...req.body, updatedAt: new Date() } },
        );
        if (!modifiedCount) {
          return reply.code(404).send({ error: "Todo not found." });
        }
        reply.code(204);
      },
    })
    .put("/:id/:status", {
      schema: { params: fastify.getSchema("schema:todo:status:params") },
      handler: async (req, reply) => {
        const done = req.params.status === "done";
        const { modifiedCount } = await todosCollection.updateOne(
          {
            _id: new fastify.mongo.ObjectId(req.params.id),
            userId: req.user.id,
          },
          { $set: { done, updatedAt: new Date() } },
        );
        if (!modifiedCount) {
          return reply.code(404).send({ error: "Todo not found." });
        }
        reply.code(204);
      },
    })
    .post("/", {
      schema: {
        body: fastify.getSchema("schema:todo:create:body"),
        response: { 201: fastify.getSchema("schema:todo:create:response") },
      },
      handler: async (req, reply) => {
        try {
          const now = new Date();
          const _id = new fastify.mongo.ObjectId();
          await todosCollection.insertOne({
            _id,
            id: _id,
            userId: req.user.id,
            ...req.body,
            done: false,
            createdAt: now,
            updatedAt: now,
          });
          reply.code(201);
          return { id: _id };
        } catch (error) {
          throw error;
        }
      },
    })
    .delete("/:id", {
      handler: async (req, reply) => {
        const { deletedCount } = await todosCollection.deleteOne({
          _id: new fastify.mongo.ObjectId(req.params.id),
          userId: req.user.id,
        });
        if (!deletedCount) {
          return reply.code(404).send({ error: "Todo not found." });
        }
        reply.code(204);
      },
    });
}
