const UserTokenModel = require("../models/userToken.model");
const userTokenUitls = require("../utils/userToken.utils");
const UserService = require("./user.service");
// const config = require("config");

class UserToken {
  // constructor(userId) {
  //   if (!userId) throw new Error("User id is required");
  //   this.#userId = userId;
  //   // this.#tokenUtils = new TokenUitls(this.#secret, this.#expiresIn);
  // }
  // #userId;
  // #tokenUtils;
  // #secret = config.get("token.secret");
  // #expiresIn = config.get("auth.accessTokenExpiresIn");

  async create(userId) {
    const userService = new UserService();

    const user = await userService.findById(userId);
    if (!user) throw new Error("User not found");
    const accessToken = this.#generateAccessToken(user);
    const refreshToken = userTokenUitls.createRefreshToken();
    const expireDate = userTokenUitls.getExpireDate();

    await UserTokenModel.create({
      user: userId,
      refreshTokenHash: userTokenUitls.generateTokenHash(refreshToken),
      expiresAt: expireDate,
    });

    return { accessToken, refreshToken };
  }

  #generateAccessToken(user) {
    const payload = {
      id: user.id,
      role: user.role,
    };
    return userTokenUitls.createAccessToken(payload);
  }

  async refreshToken(refreshToken) {
    const userToken = await UserTokenModel.findOne({
      refreshTokenHash: userTokenUitls.generateTokenHash(refreshToken),
    });
    if (!userToken) throw new Error("refresh not found");
    if (userToken.revokedAt) throw new Error("refresh token revoked");
    if (userToken.expiresAt.getTime() < Date.now())
      throw new Error("refresh token expired");
    const userService = new UserService();
    const user = await userService.findById(userToken.user);
    if (!user) throw new Error("User not found");
    const newRefreshToken = userTokenUitls.createRefreshToken();
    const newAccessToken = this.#generateAccessToken(user);
    await UserTokenModel.findByIdAndUpdate(userToken.id, {
      refreshTokenHash: userTokenUitls.generateTokenHash(newRefreshToken),
    });
    // console.log({ newAccessToken, newRefreshToken });
    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async revokeToken(refreshToken) {}
}

module.exports = UserToken;
