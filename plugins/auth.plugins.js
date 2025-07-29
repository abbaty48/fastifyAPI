import fastifyPlugin from "fastify-plugin";
import fastifyJWT from "@fastify/jwt";

export default fastifyPlugin(async (fastify) => {
  const revokeToken = new Map();

  fastify
    .register(fastifyJWT, {
      secret: fastify.secrets.JWT_TOKEN,
      trusted: function isTrusted(request, decodedToken) {
        return !revokeToken.has(decodedToken.jti);
      },
    })
    .decorate("authenticate", async (request, reply) => {
      try {
        await request.jwtVerify();
      } catch (error) {
        reply.send(error);
      }
    })
    .decorateRequest("revokeToken", function () {
      revokeToken.set(this.user.jti, true);
    })
    .decorateRequest("generateToken", async function () {
      return fastify.jwt.sign(
        {
          id: String(this.user._id),
          username: this.user.username,
        },
        {
          jti: String(Date.now()),
          expiresIn: fastify.secrets.JWT_EXPIRE_IN,
        },
      );
    });
});
