const Controller = require("../../base/controller");
const UserAuthService = require("../../services/userAuth.service");
const UserService = require("../../services/user.service");
const UserTokenService = require("../../services/userToken.service");

class UserAuthController extends Controller {
  async register({ response, body, header }) {
    const { email, fullName, password } = body;
    try {
      const userService = new UserService();
      const userTokenService = new UserTokenService();
      const userAuthService = new UserAuthService(
        userService,
        userTokenService
      );
      const { accessToken, refreshToken } = await userAuthService.register({
        email,
        fullName,
        password,
      });
      this.#setRefreshToken(header, refreshToken);
      this.#setAccessToken(header, accessToken);
      response();
    } catch (error) {
      if (error.message === "Email already exists")
        response({
          code: "EMAIL_ALREADY_EXISTS",
        });
      throw error;
    }
  }

  async login({ response, body, header }) {
    const { email, password, rememberMe } = body;
    try {
      const userService = new UserService();
      const userTokenService = new UserTokenService();
      const userAuthService = new UserAuthService(
        userService,
        userTokenService
      );
      const { accessToken, refreshToken } = await userAuthService.login(
        email,
        password
      );
      if (rememberMe) this.#setRefreshToken(header, refreshToken);
      this.#setAccessToken(header, accessToken);
      response();
    } catch (error) {
      if (error.message === "Invalid password")
        return response({ code: "LOGIN_FAILED" });
      if (error.message === "User not found")
        return response({ code: "USER_NOT_FOUND" }); // todo: rate limit - to prevent brute force / user enumeration attacks
      throw error;
    }
  }

  #setAccessToken(header, accessToken) {
    header.set("Authorization", `Bearer ${accessToken}`);
  }

  #setRefreshToken(header, refreshToken) {
    header.set("x-refresh-token", refreshToken);
  }

  async refreshToken({ response, body, header }) {
    try {
      const { refreshToken } = body;
      const userTokenService = new UserTokenService();
      const { accessToken, refreshToken: newRefreshToken } =
        await userTokenService.refreshToken(refreshToken);
      console.log({ accessToken, newRefreshToken });
      this.#setAccessToken(header, accessToken);
      this.#setRefreshToken(header, newRefreshToken);
      response({});
    } catch (error) {
      if (
        error.message === "Invalid refresh token" ||
        error.message === "refresh not found"
      )
        return response({ code: "REFRESH_TOKEN_EXPIRED" });
      throw error;
    }
  }
}

module.exports = new UserAuthController();
