import path from "node:path";
import AutoLoad from "@fastify/autoload";
import config from "./plugins/config.plugins.js";

export default async function (fastify, opts) {
  const __dirname = process.cwd();
  await fastify
    // .register(config)
    .register(AutoLoad, {
      dir: path.join(__dirname, "schemas"),
      indexPattern: /^loader.js$/i,
    })
    .register(AutoLoad, {
      dir: path.join(__dirname, "plugins"),
      ignorePattern: /.*.no-load\.js/,
      indexPattern: /^no$/i,
      dirNameRoutePrefix: false,
      options: fastify.config,
    })
    .register(AutoLoad, {
      dir: path.join(__dirname, "routes"),
      indexPattern: /.*routes(\.js|\.cjs)$/i,
      ignorePattern: /.*\.js/,
      autoHooksPattern: /.*hooks(\.js|\.cjs)$/i,
      autoHooks: true,
      cascdeHooks: true,
      options: Object.assign({}, opts),
    });
}
