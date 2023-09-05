require("dotenv").config()
const config = require("config")
const validateEnv = require("./startup/validateEnv")
// const validateConfig = require("./startup/validateConfig");
const Application = require("./app")
const logger = require("./lib/logger")
validateEnv(process.env)
new Application(config.get("mongodbURI"), config.get("port"))
  .start()
  .then(() => {
      logger.info("Application started successfully.")
  })
