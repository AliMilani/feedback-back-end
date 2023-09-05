const { compareHash } = require("../utils/password.utils")

class UserAuthService {
  /**
   * @param {import("../services/user.service")} userService
   * @param {import("../services/userToken.service")} userTokenService
   */
  constructor (userService, userTokenService) {
    this.#userService = userService
    this.#userTokenService = userTokenService
  }

  #userService
  #userTokenService

  async login (email, password) {
    try {
      const user = await this.#userService.findByEmail(email)
      await this.#verifyPassword(password, user.password)
      const tokens = await this.#userTokenService.create(user.id)
      return tokens
    } catch (error) {
      if (error.message === "User not found") throw error
      if (error.message === "Invalid password") throw error
      throw error
    }
  }

  async #verifyPassword (password, passwordHash) {
    const isPasswordValid = await compareHash(password, passwordHash)
    if (!isPasswordValid) throw new Error("Invalid password")
  }

  async register ({ email, password, fullName }) {
    try {
      const user = await this.#userService.create({
        email,
        password,
        fullName,
      })
      const tokens = await this.#userTokenService.create(user.id)
      return tokens
    } catch (error) {
      if (error.message === "Email already exists") throw error
      throw error
    }
  }

  async refreshToken (refreshToken) {
    try {
      const tokens = await this.#userTokenService.refreshToken(refreshToken)
      return tokens
    } catch (error) {
      if (error.message === "refresh not found") {
        throw new Error("Invalid refresh token") // todo: warning log
      }
      if (
        error.message === "refresh token revoked" ||
        error.message === "refresh token expired"
      ) { throw new Error("Invalid refresh token") }
      throw error
    }
  }
}

module.exports = UserAuthService
