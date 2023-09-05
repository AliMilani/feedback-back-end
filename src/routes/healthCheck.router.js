const RouteBuilder = require("../lib/routeBuilder")
const mongoose = require("mongoose")

const healthCheckRouter = new RouteBuilder({
  method: "get",
  path: "/health-check",
  controller: function ({ response }) {
    const readyState = mongoose.connection.readyState
    response({
      data: {
        db: {
          readyState,
          status: readyState === 1 ? "UP" : "DOWN",
        },
      },
    })
  },
}).build()
module.exports = healthCheckRouter
