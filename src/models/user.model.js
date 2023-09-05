const { createSchema, createModel } = require("../lib/db")
const { createHash } = require("../utils/password.utils")
const userRoles = require("../constants/userRoles.constant")

const { EMAIL_PRECISE_PATTERN } = require("../helpers/validaton.helper")

const userSchema = createSchema({
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
    match: EMAIL_PRECISE_PATTERN, // should be same in http\validators\user.validator.js email mode (quick or precise)
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
  role: {
    type: String,
    enum: Object.values(userRoles),
    default: userRoles.USER,
  },
})

userSchema.pre("save", async function (next) {
  const user = this
  if (!user.isModified("password")) return next()
  try {
    const hashedPassword = await createHash(user.password)
    user.password = hashedPassword
    return next()
  } catch (error) {
    return next(error)
  }
})

module.exports = createModel("User", userSchema)
