const FeedbackModel = require("../models/feedback.model")

class FeedbackService {
  async create (feedback) {
    const createdFeedback = (await FeedbackModel.create(feedback)).toObject()
    return createdFeedback
  }

  async findById (id) {
    const feedback = await FeedbackModel.findById(id)
    if (feedback === null) throw new Error("Feedback not found")
    return feedback.toObject()
  }

  async delete (id) {
    const deletedFeedback = await FeedbackModel.findByIdAndDelete(id)
    if (deletedFeedback === null) throw new Error("Feedback not found")
    return deletedFeedback.toObject()
  }

  async updateById (id, query) {
    const updatedFeedback = await FeedbackModel.findByIdAndUpdate(
      id,
      query,
      {
        new: true,
      }
    )
    if (updatedFeedback === null) throw new Error("Feedback not found")
    return updatedFeedback.toObject()
  }

    async getAll () {
      // todo: add pagination
    const allFeedbacks = await FeedbackModel.find(
      {},
      { __v: 0, updateAt: 0 }
    ).populate("user",{ fullName: 1 }).lean()
    return allFeedbacks
  }

  async addVote (id, userId) {
    // const updatedFeedback = await FeedbackModel.findByIdAndUpdate(id, {
    //   $addToSet: { votes: userId },
    // }, {
    //   new: true,
    // });
    // if (updatedFeedback === null) throw new Error("Feedback not found");
    // return updatedFeedback.toObject();
    return this.updateById(id, {
      $addToSet: { votes: userId },
    })
  }

  async removeVote (id, userId) {
    // const updatedFeedback = await FeedbackModel.findByIdAndUpdate(id, {
    //   $pull: { votes: userId },
    // })
    // if (updatedFeedback === null) throw new Error("Feedback not found");
    // return updatedFeedback.toObject();
    return this.updateById(id, {
      $pull: { votes: userId },
    })
  }
}

module.exports = FeedbackService
