const { createSchema, createModel } = require("../lib/db");

const passwordResetSchema = createSchema({
  email: {
    type: String,
    required: true,
  },
  expires: {
    type: Date,
    required: true,
  },
  invalidated: {
    type: Boolean,
    default: false,
  },
  codeHash: {
    type: String,
    required: true,
  }
});

module.exports = createModel("PasswordReset", passwordResetSchema);
