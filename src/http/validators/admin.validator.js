const {
  createValidator,
  makeOptional,
} = require("../../lib/validator");

const adminSchema = {
  fullName: {
    type: "string",
    min: 2,
    max: 70,
    label: "نام کامل",
  },
  email: {
    type: "email",
  },
  emailIsVerified: {
    type: "boolean",
    label: "وضعیت تایید ایمیل",
    optional: true,
  },
  password: {
    type: "string",
    min: 6,
    max: 250,
    label: "رمز عبور",
  },
};

const createAdminValidator = createValidator(adminSchema);
const updateAdminValidator = createValidator(makeOptional(adminSchema));

module.exports = { createAdminValidator, updateAdminValidator };
