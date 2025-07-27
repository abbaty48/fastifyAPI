import fastifyPlugin from "fastify-plugin";

export default async function todoRoutes(fastify, options)  {
  
  const todosCollection = fastify.mongo.db.collection('todos');

  fastify
    .get("/", {
      handler: async (req, reply) => {
        const {sort, limit, title} = req.query;
        const filter = title ? {title: new RegExp(title, 'i')} : {};
        const data = await todosCollection.find(filter, {sort, limit}).toArray();
        const totalCount = await todosCollection.countDocuments(filter);
        
        return {data, totalCount};
      }
    })
    .get("/:id", {
      handler: async (req, reply) => {
        const todo = await todosCollection.findOne({
          _id: new fastify.mongo.ObjectId(req.params.id)
        }, {projection: {_id: 0}});

        if(!todo) {
         return reply.code(404).send({error: 'Todo not found.'})
        }
        return todo;
      }
    })
    .put("/:id", {
      handler: async (req, reply) => {
        const {modifiedCount} = await todosCollection.updateOne(
          {_id: new fastify.mongo.ObjectId(req.params.id)}, 
          {$set: {...req.body, updatedAt: new Date()}});
        if(!modifiedCount) {
          return reply.code(404).send({error: 'Todo not found.'})
        }
        reply.code(204);
      }
    })
    .post("/", {
      handler: async (req, reply) => {
       try {
        const now = new Date();
        const _id = new fastify.mongo.ObjectId();
        await todosCollection.insertOne({
           _id,
          id: _id.toString(),
          ...req.body,
          createdAt: now,
          updatedAt: now
        });   
        reply.code(201);
        return {id: _id}
       } catch (error){
         throw error;
       }
      }
    })
    .delete("/:id", {
      handler: async (req, reply) => {
        const {deletedCount} = await todosCollection.deleteOne(
          {_id: new fastify.mongo.ObjectId(req.params.id)});
        if(!deletedCount) {
          return reply.code(404).send({error: 'Todo not found.'})
        }
        reply.code(204);
      }                       
    });
}
