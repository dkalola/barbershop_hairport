const express = require("express");
const appointments_get = require("./app_api_get.js");
const appointments_post = require("./app_api_post.js");
const appointments_delete = require("./app_api_delete.js");
const appointments_put = require("./app_api_put");
const indexhtml = require("./app.js");
const app = express();

// api path
app.use("/api", appointments_get);
app.use("/api", appointments_post);
app.use("/api", appointments_delete);
app.use("/api", appointments_put);

// home page path
app.use("/", indexhtml);

// dev only
const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log(`listining on ${port}...`);
});
