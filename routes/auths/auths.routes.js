import fastifyPlugin from "fastify-plugin";

export default fastifyPlugin(
  async (fastify) => {
    const userCollection = fastify.mongo.db.collection("users");

    fastify
      .get("/me", {
        handler: async (req, reply) => {},
      })
      .post("/register", {
        schema: { body: fastify.getSchema("schema:auth:register") },
        handler: async (req, reply) => {
          const { username, password } = req.body;
          if (await userCollection.findOne({ username })) {
            const err = new Error("User already exist.");
            err.statusCode = 409;
            throw err;
          }

          try {
            const { hash, salt } = await fastify.bcrypt.genHash(password);
            const _id = new fastify.mongo.ObjectId();
            const newUser = await userCollection.createOne({
              _id,
              id: _id.toString(),
              username,
              hash,
              salt,
            });
            req.log.info({ userId: newUser.id });
            reply.code(201);
            return { registered: true };
          } catch (error) {
            req.log.error("Failed to register user.");
            reply.code(500);
            return { registered: false };
          }
        },
      })
      .post("/authenticate", {
        schema: fastify.getSchema("schema:auth:register"),
        handler: async (req, res) => {
          const { username, password } = req.body;
          const user = await userCollection.findOne({ username });
          if (!user) {
            const err = new Error("User not found.");
            err.statusCode = 401;
            throw err;
          }

          const { hash } = await fastify.bcrypt.genHash(password, user.salt);
          if (hash !== user.hash) {
            const err = new Error("Wrong credential provided.");
            err.statusCode = 401;
            throw err;
          }

          req.user = user;
          return refreshHandler(req, reply);
        },
      })
      .post("/refresh", {
        schema: {
          headers: fastify.getSchema("schema:auth:token-header"),
          response: { 200: fastify.getSchema("schema:auth:token") },
        },
        handler: refreshHandler,
      })
      .post("/logout", {
        onRequest: fastify.authenticate,
        handler: async (req, reply) => {
          fastify.revokeToken();
          reply.code(204);
        },
      });

    function refreshHandler(request, reply) {
      const token = request.generateToken();
      return { token };
    }
  },
  { encapsulate: true },
);
