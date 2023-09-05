const express = require("express")
const RouteBuilder = require("../../lib/routeBuilder")
const {
  createAdminValidator,
  updateAdminValidator,
} = require("../../http/validators/admin.validator")
const adminController = require("../../http/controllers/admin.controller")

const router = express.Router()

const createAdminRouter = new RouteBuilder({
  apiValidator: createAdminValidator,
  controller: adminController.create,
  method: "post",
  path: "/",
})
router.use(createAdminRouter.build())

const getAdminRouter = new RouteBuilder({
  controller: adminController.findById,
  method: "get",
  path: "/:id",
}).useIdValadator()
router.use(getAdminRouter.build())

const updateAdminRouter = new RouteBuilder({
  apiValidator: updateAdminValidator,
  controller: adminController.update,
  method: "put",
  path: "/:id",
}).useIdValadator()
router.use(updateAdminRouter.build())

const getAllAdminsRouter = new RouteBuilder({
  controller: adminController.getAll,
  method: "get",
  path: "/",
})
router.use(getAllAdminsRouter.build())

module.exports = router
