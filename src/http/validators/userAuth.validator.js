const { createValidator } = require("../../lib/validator");

const loginSchema = {
  email: {
    type: "email",
  },
  password: {
    type: "string",
    min: 6,
    max: 250,
    label: "رمز عبور",
  },
  rememberMe: {
    type: "boolean",
    optional: true,
    default: false,
    label: "مرا به خاطر بسپار",
  },
};

const registerSchema = {
  fullName: {
    type: "string",
    min: 2,
    max: 70,
    label: "نام کامل",
  },
  email: {
    type: "email",
  },
  password: {
    type: "string",
    min: 6,
    max: 250,
    label: "رمز عبور",
  },
};

const refreshTokenSchema = {
  refreshToken: {
    type: "string",
    min: 1,
  },
};

const loginValidator = createValidator(loginSchema);
const registerValidator = createValidator(registerSchema);
const refreshTokenValidator = createValidator(refreshTokenSchema);

module.exports = { loginValidator, registerValidator, refreshTokenValidator };
