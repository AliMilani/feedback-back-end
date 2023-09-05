const RouteBuilder = require("../../lib/routeBuilder")
const {
  createFeedbackValidator,
  updateFeedbackValidator,
} = require("../../http/validators/feedback.validator.js")
const feedbackController = require("../../http/controllers/feedback.controller.js")

const router = require("express").Router()

const createFeedbackRouter = new RouteBuilder({
  apiValidator: createFeedbackValidator,
  controller: feedbackController.create,
  method: "post",
  path: "/",
})
  // .addFileUpload(imageUplodaOptions)
  .setUserRole(RouteBuilder.roles.USER)
  .build()
router.use(createFeedbackRouter)

const getFeedbackRouter = new RouteBuilder({
  controller: feedbackController.getById,
  method: "get",
  path: "/:id",
})
  .useIdValadator()
  .setUserRole(RouteBuilder.roles.USER)
  .build()
router.use(getFeedbackRouter)

const updateFeedbackRouter = new RouteBuilder({
  apiValidator: updateFeedbackValidator,
  controller: feedbackController.update,
  method: "put",
  path: "/:id",
})
  .useIdValadator()
  .setUserRole(RouteBuilder.roles.USER)
  // .addFileUpload(imageUplodaOptions)
  .build()
router.use(updateFeedbackRouter)

const getAllFeedbacksRouter = new RouteBuilder({
  controller: feedbackController.getAll,
  method: "get",
  path: "/",
})
  .setUserRole(RouteBuilder.roles.USER)
  .build()
router.use(getAllFeedbacksRouter)

const deleteFeedbackRouter = new RouteBuilder({
  controller: feedbackController.delete,
  method: "delete",
  path: "/:id",
})
  .useIdValadator()
  .setUserRole(RouteBuilder.roles.USER)
  .build()
router.use(deleteFeedbackRouter)

const addVoteRouter = new RouteBuilder({
  controller: feedbackController.addVote,
  method: "post",
  path: "/:id/vote",
})
  .useIdValadator()
  .setUserRole(RouteBuilder.roles.USER)
  .build()
router.use(addVoteRouter)

const removeVoteRouter = new RouteBuilder({
  controller: feedbackController.removeVote,
  method: "delete",
  path: "/:id/vote",
})
  .useIdValadator()
  .setUserRole(RouteBuilder.roles.USER)
  .build()
router.use(removeVoteRouter)

const FIVE_MB = 5 * 1024 * 1024

const imageUploadOptions = {
  fieldName: "image",
  subDir: "feedback",
  multerOptions: {
    limits: {
      fileSize: FIVE_MB,
    },
    fileFilter: function (req, file, cb) {
      const filetypes = ["jpeg", "jpg", "png"]
      const fileName = file.originalname
      const fileExt = require("path").extname(fileName).toLowerCase().slice(1)
      const isValid = filetypes.includes(fileExt)
      cb(null, isValid)
    },
  },
}

const updateFeedbackImageRouter = new RouteBuilder({
  controller: feedbackController.updateImage,
  method: "put",
  path: "/:id/image",
})
  .addFileUpload(imageUploadOptions)
  .useIdValadator()
  .setUserRole(RouteBuilder.roles.USER)
  .build()
router.use(updateFeedbackImageRouter)
module.exports = router
