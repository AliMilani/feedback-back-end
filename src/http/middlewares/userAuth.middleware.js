const userTokenUtils = require("../../utils/userToken.utils")
const response = require("../../utils/response.utils")

const userAuthMiddleware = async (req, res, next) => {
  const authHeader = req.header("Authorization")
  const accessToken = authHeader && authHeader.split(" ")[1]
  if (!authHeader || !accessToken) {
 return response(res, {
      code: "ACCESS_TOKEN_REQUIRED",
    })
}

  try {
    const user = userTokenUtils.verifyAccessToken(accessToken)
    req.user = user
  } catch (error) {
    if (error.message === "access token expired") {
 return response(res, {
        code: "ACCESS_TOKEN_EXPIRED",
      })
}

    if (error.message === "access token invalid") {
 return response(res, {
        code: "ACCESS_TOKEN_INVALID",
      })
}

    throw error
  }

  next()
}

module.exports = userAuthMiddleware
