const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const ms = require("ms");

class Token {
  #tokenSecret;
  #tokenExpiresIn;
  constructor(tokenSecret, tokenExpiresIn) {
    this.#tokenSecret = tokenSecret;
    this.#tokenExpiresIn = tokenExpiresIn;
  }

  createAccessToken(payload) {
    return jwt.sign(payload, this.#tokenSecret, {
      expiresIn: this.#tokenExpiresIn,
    });
  }

  verifyAccessToken(token) {
    try {
      return jwt.verify(token, this.#tokenSecret);
    } catch (error) {
      if (error.name === "TokenExpiredError")
        throw new Error("access token expired");
      if (
        error.message === "invalid token" ||
        error.message === "jwt malformed"
      )
        throw new Error("access token invalid"); //todo: log warning

      if (error.message === "invalid signature")
        throw new Error("access token invalid"); //todo: log warning
      throw error;
    }
  }

  createRefreshToken() {
    return crypto.randomBytes(64).toString("hex");
  }

  generateTokenHash(token) {
    return crypto.createHash("sha256").update(token).digest("hex");
  }

  getExpireDate() {
    const now = new Date();
    return new Date(now.getTime() + ms(this.#tokenExpiresIn));
  }
}

module.exports = Token;
