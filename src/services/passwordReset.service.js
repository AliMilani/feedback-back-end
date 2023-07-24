const ResetPasswordModel = require("../models/passwordReset.model");
const config = require("config");
const ms = require("ms");

class ResetPasswordService {
  /**
   * @param {import("./user.service")} userService
   */
  constructor(userService) {
    this.#userService = userService;
  }
  #userService;

  async requestReset(email) {
  
      const expires = new Date(
        Date.now() + ms(config.get("passwordResetExpiresIn"))
      );
      await this.#userService.findByEmail(email);
      await this.#invalidateExistingRequests(email);
      const code = this.#generateCode();
      const hash = this.#hashCode(code.toString());
      await ResetPasswordModel.create({ email, expires, codeHash: hash });
      return code;

  }

  #invalidateExistingRequests(email) {
    return ResetPasswordModel.updateMany(
      { email, expires: { $gt: new Date() } },
      { invalidated: true }
    );
  }

  #generateCode() {
    return Math.floor(100000 + Math.random() * 900000);
  }

  #hashCode(code) {
    return require("crypto").createHash("sha256").update(code).digest("hex");
  }

  async resetPassword({ email, code, password }) {
    const isValid = await this.verifyResetCode(email, code);
    if (!isValid) throw new Error("code expired or invalid");

    await this.#invalidateExistingRequests(email);
    await this.#setNewPassword(email, password);
  }

  async #setNewPassword(email, password) {
    try {
      const user = await this.#userService.findByEmail(email);
      return this.#userService.update(user.id, {
        password,
      });
    } catch (error) {
      if (error.message === "User not found") throw new Error("user not found");
      throw error;
    }
  }

  async verifyResetCode(email, code) {
    const lastRequest = await this.#getUserLastRequest(email);
    const codeHash = this.#hashCode(code.toString());
    return (
      lastRequest &&
      this.#isActive(lastRequest) &&
      lastRequest.codeHash === codeHash &&
      lastRequest.invalidated !== true
    );
  }

  #getUserLastRequest(email) {
    return ResetPasswordModel.findOne({ email }).sort({ createdAt: -1 });
  }

  #isActive(request) {
    return !request.invalidated && request.expires > new Date();
  }
}

module.exports = ResetPasswordService;
