const v1Router = require("express").Router();
const adminRouter = require("./admin.router");
const userAuthRouter = require("./userAuth.router");

v1Router.use("/admins", adminRouter);
v1Router.use("/auth", userAuthRouter);

module.exports = v1Router;
