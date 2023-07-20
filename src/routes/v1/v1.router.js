const v1Router = require("express").Router();
const adminRouter = require("./admin.router"); 

v1Router.use("/admins",adminRouter)
    
module.exports = v1Router;
