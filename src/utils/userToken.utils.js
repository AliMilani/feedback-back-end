const TokenUitls = require("./token.utils");
const config = require('config')

module.exports = new TokenUitls(
  config.get("userTokenSecret"),
  config.get("auth.refreshTokenExpiresIn")
);
