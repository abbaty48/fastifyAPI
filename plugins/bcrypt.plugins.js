import fastifyPlugin from "fastify-plugin";
import bcrypt from "bcrypt";

export default fastifyPlugin(async (fastify) => {
  fastify.decorate("bcrypt", {
    genHash: async (password, salt = 10) => {
      const _salt = await bcrypt.salt(salt);
      const hash = bcrypt.hash(password);
      return {
        salt: _salt,
        hash,
      };
    },
    compareHash: async (password, hashPassword) => {
      return await bcrypt.compare(password, hashPassword);
    },
  });
});
