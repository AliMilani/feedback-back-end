const mongoose = require("mongoose");

const defaultTypes = {
  object: {
    strict: true,
  },
  objectID: {
    ObjectID: mongoose.Types.ObjectId,
    custom: async (value, errors, schema) => {
      if (!value && schema.optional) return value;
      if (!schema.modelName)
        throw new Error("modelName is required for objectID type");
      const Model = mongoose.model(schema.modelName);
      if (await Model.exists({ _id: value })) return value;
      errors.push({ type: "idNotExist", actual: value, label: schema.label });
    },
  },
  email: {
    min: 6,
    max: 254,
    normalize: true,
    mode: "precise",
    label: "ایمیل",
  },
};

module.exports = defaultTypes;
