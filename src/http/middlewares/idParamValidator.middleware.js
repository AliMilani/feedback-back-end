const mongoose = require("mongoose")
const response = require("../../utils/response.utils")

const idparamValidator = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return response(res, {
      code: "INVALID_ID_PARAM",
    })
  }
  next()
}

module.exports = idparamValidator
