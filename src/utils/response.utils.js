const responseCodes = require("../constants/responseCodes");

const response = (res, { code = "OK", data, errors } = {}) => {
  if (typeof code !== "string") throw new Error("code must be a string");
  const responseCode = responseCodes[code];
  if (!responseCode)
    throw new Error(
      "response code is not defined, please check responseCodes.js"
    );
  const { message, devMessage, status } = responseCode;
  const body = { code, message, data };
  if (process.env.NODE_ENV === "development") body.devMessage = devMessage;
  if (errors) body.errors = errors;
  return res.status(status).json(body);
};


module.exports = response;
