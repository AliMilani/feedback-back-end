const express = require("express");
require("express-async-errors");
const response = require("../../utils/response.utils");
const { Error: MongooseError } = require("mongoose");

const apiError = (err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return response(res, {
      code: "JSON_SYNTAX_ERROR",
    });
  }
  if ((err.type = "entity.too.large")) {
    return response(res, {
      code: "PAYLOAD_TOO_LARGE",
    });
  }
  if (err instanceof MongooseError)
    response(res, {
      code: "DATABASE_ERROR",
      errors: process.env.NODE_ENV === "development" ? err : undefined,
    });
  else
    response(res, {
      code: "SERVER_ERROR",
      errors: process.env.NODE_ENV === "development" ? err : undefined,
    });
  console.error(`${err.message} \n\n ${err.stack || ""}`);
  process.exit(1);
};

module.exports = apiError;
