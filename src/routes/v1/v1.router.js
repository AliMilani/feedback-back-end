const v1Router = require("express").Router()
const adminRouter = require("./admin.router")
const userAuthRouter = require("./userAuth.router")
const feedbackRouter = require("./feedback.router")
const passwordResetRouter = require('./passwordReset.router')

v1Router.use("/admins", adminRouter)
v1Router.use("/auth", userAuthRouter)
v1Router.use("/feedbacks", feedbackRouter)
v1Router.use("/password-reset", passwordResetRouter)

module.exports = v1Router
