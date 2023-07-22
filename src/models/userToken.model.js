const mongoose = require("mongoose");
const { createSchema, createModel } = require("../lib/db");

const userTokenSchema = createSchema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  refreshTokenHash: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  revokedAt: {
    type: Date,
  },
});

module.exports = createModel("UserToken", userTokenSchema);