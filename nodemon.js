import nodemon from "nodemon";

nodemon({
  // watch: ["app.js", "config", "models", "routes"],
  ext: "ts,js,mjs,js,json",
  ignore: "node_modules",
  exec: "node app.js",
});
