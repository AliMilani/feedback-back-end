const { default: mongoose } = require("mongoose")
const { createSchema, createModel } = require("../lib/db")

const feedbackSchema = createSchema({
  title: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  imagePath: {
    type: String,
  },
  votes: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  }
})

module.exports = createModel("Feedback", feedbackSchema)
