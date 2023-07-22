const Validator = require("fastest-validator");
const validatorMessages = require("./validatorMessages");
const validatorDefaultTypes = require("./validatorDefaultTypes");

const options = {
  messages: validatorMessages,
  defaults: validatorDefaultTypes,
  useNewCustomCheckerFunction: true,
};

const createValidator = (schema) => {
  const v = new Validator(options);
  return v.compile({ ...schema, $$async: true, $$strict: true });
};

const createOptionalValidator = (schema) => {
  const v = new Validator(options);
  const optionalSchema = Object.fromEntries(
    Object.entries(schema).map(([key, value]) => {
      return [
        key,
        {
          ...value,
          optional: true,
        },
      ];
    })
  );

  return v.compile({ ...optionalSchema, $$async: true, $$strict: true });
};

module.exports = { createValidator, createOptionalValidator };
