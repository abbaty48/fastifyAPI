import path from "node:path";
import AutoLoad from "@fastify/autoload";
import config from "./plugins/config.plugin.no-load.js";

export default async function (fastify, opts) {
  const __dirname = process.cwd();
  await fastify
    .register(config)
    .register(AutoLoad, {
      dir: "./schemas",
      indexPattern: /^.*loader\.js$/,
    })
    .register(AutoLoad, {
      dir: path.join(__dirname, "plugins"),
      ignorePattern: /.*.no-load\.js/,
      indexPattern: /^no$/i,
      dirNameRoutePrefix: false,
      options: fastify.config,
    })
    .register(AutoLoad, {
      autoHooks: true,
      cascdeHooks: true,
      ignorePattern: /.*\.js/,
      dir: path.join(__dirname, "routes"),
      indexPattern: /.*routes(\.js|\.cjs)$/i,
      autoHooksPattern: /.*hooks(\.js|\.cjs)$/i,
      options: Object.assign({}, opts),
    })
    .after((err) => {
      fastify.log.error("Error occur while registering a plugin: ", err);
    });
}
