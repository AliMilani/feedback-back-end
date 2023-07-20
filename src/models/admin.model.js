const { createSchema, createModel } = require("../lib/db");
const { createHash } = require("../utils/password.utils");

const { EMAIL_PRECISE_PATTERN } = require("../helpers/validaton.helper");

const adminSchema = createSchema({
  fullName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 70,
  },
  email: {
    type: String,
    unique: true,
    minlength: 6,
    maxlength: 254,
    lowercase: true,
    trim: true,
    required: true,
    match: EMAIL_PRECISE_PATTERN, // should be same in http\validators\admin.validator.js email mode (quick or precise)
  },
  emailIsVerified: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 250,
    select: false,
  },
});

adminSchema.pre("save", async function (next) {
  const admin = this;
  if (!admin.isModified("password")) return next();
  try {
    const hashedPassword = await createHash(admin.password);
    admin.password = hashedPassword;
    return next();
  } catch (error) {
    return next(error);
  }
});

module.exports = createModel("Admin", adminSchema);
