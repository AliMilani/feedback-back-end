const { createValidator } = require("../../lib/validator");

const requestResetSchema = {
  email: {
    type: "email",
    label: "ایمیل",
  },
};

const validateReuqest = {
  email: {
    type: "email",
    label: "ایمیل",
  },
  code: {
      type: "number",
      label: "کد",
  },
};

const resetPasswordSchema = {
  email: {
    type: "email",
    label: "ایمیل",
  },
  code: {
    type: "number",
    label: "کد",
},
  password: {
      type: "string",
      label: "رمز عبور",
  },
};
module.exports.requestReset = createValidator(requestResetSchema);
module.exports.validateReuqest = createValidator(validateReuqest);
module.exports.resetPassword = createValidator(resetPasswordSchema);
