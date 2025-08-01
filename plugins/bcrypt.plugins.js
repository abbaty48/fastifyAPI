import fastifyPlugin from "fastify-plugin";
import bcrypt from "bcrypt";

export default fastifyPlugin(async (fastify, _, next) => {
  fastify.decorate("bcrypt", {
    genHash: async (
      { password, salt = null, round = 10 } = { password, salt, round },
    ) => {
      const _salt = await bcrypt.genSalt(round);
      const hash = await bcrypt.hash(password, salt || _salt);
      return {
        salt: _salt,
        hash,
      };
    },
    compareHash: async (password, hashPassword) => {
      return await bcrypt.compare(password, hashPassword);
    },
  });
  next();
});
