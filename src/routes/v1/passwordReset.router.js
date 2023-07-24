const RouteBuilder = require("../../lib/routeBuilder");
const passwordResetController = require("../../http/controllers/passwordReset.controller");
const passwordResetValidator = require("../../http/validators/passwordReset.validator.js");

const router = require("express").Router();

const requestResetRouter = new RouteBuilder()
  .setApiValidator(passwordResetValidator.requestReset)
  .setController(passwordResetController.requestReset)
  .setMethod("post")
  .setPath("/request")
  .build();
router.use(requestResetRouter);

const validateRequestRouter = new RouteBuilder()
    .setApiValidator(passwordResetValidator.validateReuqest)
    .setController(passwordResetController.validateReuqest)
    .setMethod("post")
    .setPath("/validate")
    .build();
router.use(validateRequestRouter);

const resetPasswordRouter = new RouteBuilder()
    .setApiValidator(passwordResetValidator.resetPassword)
    .setController(passwordResetController.resetPassword)
    .setMethod("post")
    .setPath("/reset")
    .build();
router.use(resetPasswordRouter);

module.exports = router;