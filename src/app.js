const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const logger = require("./lib/logger");
const apiErrorMiddleware = require('./http/middlewares/apiErrors.middleware')

class App {
    #mongoURI;
    #port;
    #server;
    #dbConnection;
    #app = express();
    constructor(mongoURI, port) {
        this.#port = port;
        this.#mongoURI = mongoURI;
        this.#loadMiddlewares();
        this.#loadRoutes();
        this.#loadErrorHandlers()
    }

    #loadMiddlewares() {
        this.#app.use(cors());
        this.#app.use(express.json());
        this.#app.use(morgan("dev"));
        // this.#app.use(require("./http/middlewares/apiLogger.middleware.js"))
        this.#app.use(express.urlencoded({ extended: true }));
    }

    #loadRoutes() {
        this.#app.use("/api", require("./routes"));
    }

    #loadErrorHandlers() {
        this.#app.use(apiErrorMiddleware);
    }

    async start() {
        await this.#connectDb();
        this.#server = this.#app.listen(this.#port, () => {
            logger.info(`Server is running on port ${this.#port}`);
        });
        return this.#server;
    }

    async #connectDb() {
        this.#dbConnection = await mongoose.connect(this.#mongoURI, {});
        logger.info("mongodb connected");
    }

    // #handleDatabaseError() {

    getDbConnection() {
        if (!this.#dbConnection.readyState) throw new Error("Database is not connected");
        return this.#dbConnection;
    }

    getServer() {
        if (!this.#server) throw new Error("Server is not running");
        return this.#server;
    }
}

module.exports = App;
