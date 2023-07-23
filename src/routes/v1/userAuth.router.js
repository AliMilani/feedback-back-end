const RouteBuilder = require("../../lib/routeBuilder");
const userAuthController = require("../../http/controllers/userAuth.controller");
const userAuthValidator = require("../../http/validators/userAuth.validator");
const router = require("express").Router();

const registerRouter = new RouteBuilder({
  controller: userAuthController.register,
  apiValidator: userAuthValidator.registerValidator,
  method: "post",
  path: "/register",
}).build();
router.use(registerRouter);

const loginRouter = new RouteBuilder({
  controller: userAuthController.login,
  apiValidator: userAuthValidator.loginValidator,
  method: "post",
  path: "/login",
}).build();
router.use(loginRouter);

const refreshToken = new RouteBuilder({
  controller: userAuthController.refreshToken,
  apiValidator: userAuthValidator.refreshTokenValidator,
  method: "post",
  path: "/refresh-token",
}).build();
router.use(refreshToken);

module.exports = router;
