const logger = require("../../lib/logger")
const winston = require("winston")

const apiLoggerlevels = {
  levels: {
    error: 0,
    fail: 1,
    success: 2,
  },
  colors: {
    error: "red",
    fail: "yellow",
    success: "green",
  },
}

winston.addColors(apiLoggerlevels.colors)
const colorizer = winston.format.colorize()

const httpConsoleformat = winston.format.printf(
  ({
    level,
    message,
    timestamp,
    method,
    path,
    statusCode,
    responseCode,
    responseMessage,
    }) => {
        // colorizer
    return `${timestamp} ${level}: ${method} ${path} ${statusCode} ${responseCode} ${responseMessage}`
  }
)

const apiLogger = winston.createLogger({
    levels: apiLoggerlevels.levels,

  transports: [
    new winston.transports.Console({
      level: "success",
    }),
  ],
})

// const apiLogger = (req, res, next) => {

// const winston = require('winston');

// // Define a custom colorizer function
// const colorizer = winston.format.colorize();

// // Create a Winston logger instance
// const logger = winston.createLogger({
//   format: winston.format.combine(
//     winston.format.printf((info) => {
//       // Apply colorization to the message
//       const message = colorizer.colorize(info.level, info.message);
//       return `${info.timestamp} [${info.level}]: ${message}`;
//     })
//   ),
//   transports: [new winston.transports.Console()]
// });

// // Usage examples
// logger.info('This is an information message');
// logger.warn('This is a warning message');
// logger.error('This is an error message');
