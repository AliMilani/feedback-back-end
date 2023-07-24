const Controller = require("../../base/controller");
const PasswordResetService = require("../../services/passwordReset.service");
const UserService = require("../../services/user.service");
const emailUtil = require("../../utils/email.utils");

class PasswordResetController {
  #passwordResetService = new PasswordResetService(new UserService());
  requestReset = async ({ body, response }) => {
    try {
      const { email } = body;
      const code = await this.#passwordResetService.requestReset(email);
      await emailUtil({
        to: email,
        html: `<h1>Reset your password</h1>
        <p>Enter the following code to reset your password: <br><strong style="
            font-size: 45;
        ">${code}</strong></p>`,
        subject: "Reset your password",
      });
      response();
    } catch (error) {
      if (error.message === "User not found")
        response({ code: "USER_NOT_FOUND" });
      throw error;
    }
  };

  validateReuqest = async ({ body, response }) => {
    const { email, code } = body;
    const isValid = await this.#passwordResetService.verifyResetCode(email, code);
    if (!isValid) return response({ code: "INVALID_RESET_CODE" });
    response();
  };

  resetPassword = async ({ body, response }) => {
    try {
      const { email, code, password } = body;
      await this.#passwordResetService.resetPassword({ code, email, password });
      response();
    } catch (error) {
      if (error.message === "code expired or invalid")
        return response({
          code: "INVALID_RESET_CODE",
        });
      throw error;
    }
  };
}
module.exports = new PasswordResetController();
