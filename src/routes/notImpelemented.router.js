const RouteBuilder = require("../lib/routeBuilder");

const notImplementedRouter = new RouteBuilder().
    setPath("/").
    setMethod("get").
    setController(function ({ response }) {
        response({ code: "ROUTE_NOT_IMPLEMENTED" });
    }).build();

module.exports = notImplementedRouter;