const path = require("node:path")
const Controller = require("../../base/controller")
const FeedbackService = require("../../services/feedback.service")
const fs = require("node:fs")

class FeedbackController extends Controller {
  #feedbackService = new FeedbackService()
  async create ({ response, body, user, file }) {
    // const imagePath = this.#getImagePath(file);
    const createdFeedback = await this.#feedbackService.create({
      ...body,
      user: user.id,
      // imagePath,
    })
    response({ data: createdFeedback, code: "CREATED" })
  }

  #getImagePath (file) {
    const path = file ? file.path : null
    return path.replace("public", "")
  }

  async update ({ response, body, user, file, params }) {
    try {
      const feedbackId = params.id
      // const { imagePath: oldImagePath } = await this.#feedbackService.findById(
      //   feedbackId
      // );
      // const imagePath = this.#getImagePath(file);
      await this.#verifyUserPermission(feedbackId, user.id)
      const feedbackToUpdate = {
        ...body,
        user: user.id,
      }
      // if (imagePath) feedbackToUpdate.imagePath = imagePath;
      const updatedFeedback = await this.#feedbackService.updateById(
        feedbackId,
        feedbackToUpdate
      )
      // if (oldImagePath) this.#deleteImage(oldImagePath);
      response({ data: updatedFeedback })
    } catch (error) {
      if (this.#isNotFoundError(error)) return this.#handleNotFound(response)
      if (this.#isOwnerError(error)) return this.#handleOwnerError(response)
      throw error
    }
  }

  #verifyUserPermission = async (feedbackId, userId) => {
    const { user: feedbackOwner } = await this.#feedbackService.findById(
      feedbackId
    )
    if (feedbackOwner.toString() !== userId.toString()) { throw new Error("User is not owner of feedback") }
  }

  #deleteImage (imagePath) {
    fs.unlinkSync(path.join(__dirname, "../../../public", imagePath))
  }

  #isNotFoundError = (error) => error.message === "Feedback not found"

  #handleNotFound = (response) => response({ code: "FEEDBACK_NOT_FOUND" })

  #isOwnerError = (error) => error.message === "User is not owner of feedback"

  #handleOwnerError = (response, file) => {
    if (file) {
      const imagePath = this.#getImagePath(file)
      if (imagePath) this.#deleteImage(imagePath)
    }
    response({ code: "USER_IS_NOT_OWNER" })
  }

  async getById ({ response, params }) {
    try {
      const feedbackId = params.id
      const feedback = await this.#feedbackService.findById(feedbackId)
      response({ data: feedback })
    } catch (error) {
      if (this.#isNotFoundError(error)) return this.#handleNotFound(response)
      throw error
    }
  }

  async delete ({ response, params }) {
    try {
      const feedbackId = params.id
      await this.#verifyUserPermission(feedbackId, user.id)
      const deletedFeedback = await this.#feedbackService.delete(feedbackId)
      if (deletedFeedback.imagePath) { this.#deleteImage(deletedFeedback.imagePath) }
      response({ data: deletedFeedback })
    } catch (error) {
      if (this.#isNotFoundError(error)) return this.#handleNotFound(response)
      if (this.#isOwnerError(error)) return this.#handleOwnerError(response)
      throw error
    }
  }

  async getAll ({ response }) {
    const feedbacks = await this.#feedbackService.getAll()
    response({ data: feedbacks })
  }

  async updateImage ({ response, file, params, user }) {
    try {
      const feedbackId = params.id
      await this.#verifyUserPermission(feedbackId, user.id)

      const { imagePath: oldImagePath } = await this.#feedbackService.findById(
        params.id
      )
      const imagePath = this.#getImagePath(file)
      const updatedFeedback = await this.#feedbackService.updateById(
        feedbackId,
        {
          imagePath,
        }
      )
      if (oldImagePath && imagePath) this.#deleteImage(oldImagePath)
      response({ data: updatedFeedback })
    } catch (error) {
      if (this.#isNotFoundError(error)) return this.#handleNotFound(response)
      if (this.#isOwnerError(error)) {
        return this.#handleOwnerError(response, file)
      }
      throw error
    }
  }

  async addVote ({ response, user, params }) {
    try {
      const feedbackId = params.id
      const updatedFeedback = await this.#feedbackService.addVote(
        feedbackId,
        user.id
      )
      response({ data: updatedFeedback })
    } catch (error) {
      if (this.#isNotFoundError(error)) return this.#handleNotFound(response)
      throw error
    }
  }

  async removeVote ({ response, user, params }) {
    try {
      const feedbackId = params.id
      const updatedFeedback = await this.#feedbackService.removeVote(
        feedbackId,
        user.id
      )
      response({ data: updatedFeedback })
    } catch (error) {
      if (this.#isNotFoundError(error)) return this.#handleNotFound(response)
      throw error
    }
  }
}

module.exports = new FeedbackController()
