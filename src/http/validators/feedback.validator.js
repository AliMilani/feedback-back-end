const { createValidator,makeOptional } = require("../../lib/validator")

const feedbackSchema = {
    title: {
        type: "string",
        label: "عنوان فیدبک",
    },
    details: {
        type: "string",
        label: "جزئیات فیدبک",
    },
}

const createFeedbackValidator = createValidator(feedbackSchema)
const updateFeedbackValidator = createValidator(makeOptional(feedbackSchema))

module.exports = { createFeedbackValidator, updateFeedbackValidator }
