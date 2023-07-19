const { str, cleanEnv, url } = require('envalid')

const validateEnv = (env) => {
    const defualtSpec = {
        NODE_ENV: str({
            choices: ["development", "production", "test"],
            desc: "The environment in which the app is running  (e.g. development, production)",
            example: "development",
        }),
    }
    const specByEnv = {
        production: {
            MONGODB_URI: url({
                desc: "The url to the mongodb instance",
                docs: "https://docs.mongodb.com/manual/reference/connection-string/",
            }),
        },
        development: {},
        test: {},
    };
    cleanEnv(env, { ...defualtSpec, ...specByEnv[env.NODE_ENV] });
}

module.exports = validateEnv