import { stringify as csvStringify } from "csv-stringify";
import fastifyMultipart from "@fastify/multipart";
import { parse as csvParse } from "csv-parse";
import fastifyPlugin from "fastify-plugin";

export default fastifyPlugin(async function (fastify) {
  const todosCollection = fastify.mongo.db.collection("todos");

  fastify.register(fastifyMultipart, {
    attachFieldsToBody: "keyValues",
    sharedSchemaId: "schema:todos:import:file",
    limits: {
      files: 1,
      fields: 10,
      fieldSize: 100,
      fieldNameSize: 50,
      fileSize: 1_000_000,
    },
    async onFile(part) {
      const lines = [];
      const stream = part.pipe(
        csvParse({
          bom: true,
          trim: true,
          columns: true,
          skip_empty_lines: true,
        }),
      );
      for await (const { title, done } of stream) {
        lines.push({ title, done: done === "true" });
      }
      part.value = lines;
    },
  });
  /* POST  /import */
  fastify.route({
    method: "POST",
    url: "/import",
    schema: {
      body: {
        type: "object",
        required: ["todoListFile"],
        properties: {
          todoListFile: {
            type: "array",
            items: {
              type: "object",
              required: ["title", "done"],
              properties: {
                title: { type: "string" },
                done: { type: "boolean" },
              },
            },
          },
        },
      },
    },
    handler: async (req, reply) => {
      try {
        const { insertedId } = await todosCollection.insertOne(
          req.body.todoListFile,
        );
        reply.code(201);
        return !!insertedId;
      } catch {
        return false;
      }
    },
  });
  /* POST /export */
  fastify.route({
    method: "POST",
    url: "/export",
    schema: {
      query: {
        type: "object",
        properties: {
          title: { type: "string" },
        },
      },
    },
    handler: async (req, reply) => {
      const { title } = req.query;
      const cursor = todosCollection
        .find(
          { title: new RegExp(title, "i") },
          {
            limits: 10,
            skip: 0,
          },
        )
        .stream();
      reply
        .header("content-disposition", 'attachment; filename="todo-list.csv"')
        .type("text/csv");
      return cursor.pipe(
        csvStringify({
          header: true,
          qouted_string: true,
          columns: ["id", "title", "done", "createdAt", "updatedAt"],
          cast: {
            boolean: (value) => (value ? "true" : "false"),
            date: (value) => value.toISOString(),
          },
        }),
      );
    },
  });
});
