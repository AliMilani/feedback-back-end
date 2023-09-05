const RouteBuilder = require("../lib/routeBuilder")

const notImplementedRouter = new RouteBuilder()
  .setPath("/*")
  .setMethod("all")
  .setController(function ({ response }) {
    response({ code: "ROUTE_NOT_IMPLEMENTED" })
  })
  .build()

module.exports = notImplementedRouter
