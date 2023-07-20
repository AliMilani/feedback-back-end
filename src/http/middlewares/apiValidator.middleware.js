const { isEmpty } = require("../../helpers/object.helper");
const response = require("../../utils/response.utils");

const apiValidateMiddleware = (validator) => async (req, res, next) => {
  const body = req.body;
  if (!body || isEmpty(body))
    return response(res, {
      code: "EMPTY_INPUT_BODY",
    });

  const validationResult = await validator(body);
  if (validationResult !== true)
    return response(res, {
      code: "INPUT_DATA_INVALID",
      errors: validationResult
    });

  next();
};

module.exports = apiValidateMiddleware;
