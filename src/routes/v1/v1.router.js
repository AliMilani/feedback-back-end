const RouteBuilder = require("../../lib/routeBuilder");
const v1Router = require("express").Router();

const healthCheckRoute = new RouteBuilder({
  path: "/health-check",
  controller: function ({ response }) {
    response({ code: "INVALID_ID_PARAM" });
  },
  method: "get",
}).build();

v1Router.use(healthCheckRoute);

module.exports = v1Router;
