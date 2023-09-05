const UserModel = require("../models/user.model")
const { createHash } = require("../utils/password.utils")

class UserService {
  async create (user) {
    try {
      const createdUser = (await UserModel.create(user)).toObject()
      return this.#excludePassword(createdUser)
    } catch (error) {
      this.#catchDuplicateEmail(error)
      throw error
    }
  }

  #catchDuplicateEmail = (error) => {
    if (error.code === 11000) {
      if (error.keyValue.email) {
        throw new Error("Email already exists")
      }
    }
  }

  #excludePassword = (user) => {
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  async findById (id) {
    const user = await UserModel.findById(id)
    if (user === null) throw new Error("User not found")
    return user.toObject()
  }

  async findByEmail (email) {
    const user = await UserModel.findOne({ email }).select("password")
    if (!user) throw new Error("User not found")
    return user.toObject()
  }

  async delete (id) {
    const deletedUser = await UserModel.findByIdAndDelete(id)
    if (deletedUser === null) throw new Error("User not found")
    return deletedUser.toObject()
  }

  async update (id, user) {
    try {
      const targetUser = await this.findById(id)
      if (user.email && user.email === targetUser.email) delete user.email
      if (user.password) user.password = await createHash(user.password)
      const updatedUser = await UserModel.findByIdAndUpdate(id, user, {
        new: true,
      })
      return updatedUser.toObject()
    } catch (error) {
      this.#catchDuplicateEmail(error)
      throw error
    }
  }

  async getAll () {
    // todo: add pagination
    const users = await UserModel.find().lean()
    return users.map((user) => user.toObject())
  }
}

module.exports = UserService
