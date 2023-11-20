import nodemon from "nodemon";

nodemon({
  watch: ["src", "config", "models", "routes"],
  ext: "ts,js,mjs,js,json",
  ignore: "node_modules",
  exec: "node src/main.js",
});
