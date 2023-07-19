const Validator = require("fastest-validator");
const validatorMessages = require("./validatorMessages");
const mongoose = require("mongoose");

const options = {
  messages: validatorMessages,
  defaults: {
    objectID: {
      ObjectID: mongoose.Types.ObjectId,
      custom: async (value, errors, schema) => {
        if (!value && schema.optional) return value;
        if (!schema.modelName)
          throw new Error("modelName is required for objectID type");
        const Model = mongoose.model(schema.modelName);
        if (await Model.exists({ _id: value })) return value;
        errors.push({ type: "idNotExist", actual: value, label: schema.label })
      },
    },
    object: {
      strict: true,
    },
  },
  useNewCustomCheckerFunction: true,
};

const createValidator = (schema) => {
  const v = new Validator(options);
  return v.compile({ ...schema, $$async: true, $$strict: true });
};

module.exports = createValidator;
