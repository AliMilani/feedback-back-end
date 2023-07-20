const mongoose = require("mongoose");

const createModel = (modelName, schema) => {
  return mongoose.model(modelName, schema);
};

/**
 * @param {import("mongoose").SchemaDefinition} schemaDefinition
 * @returns {mongoose.Schema}
 */
const createSchema = (schemaDefinition) => {
  /**
   * @type {import("mongoose").SchemaOptions}
   */
  const schemaDefaultOptions = {
    timestamps: true,
    toObject: {
      virtuals: true,
      transform: function (_, ret) {
        delete ret.__v;
        ret.id = ret._id;
        delete ret._id;
      },
    },
  };
  return new mongoose.Schema(schemaDefinition, schemaDefaultOptions);
};

module.exports = { createModel, createSchema };
