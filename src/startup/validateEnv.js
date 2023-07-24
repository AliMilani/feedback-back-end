const { str, cleanEnv, url, host, port } = require("envalid");

const validateEnv = (env) => {
  const defualtSpec = {
    NODE_ENV: str({
      choices: ["development", "production", "test"],
      desc: "The environment in which the app is running  (e.g. development, production)",
      example: "development",
    }),
    USER_TOKEN_SECRET: str({ desc: "The secret used to sign the user tokens" }),
    SMTP_HOST: host({ desc: "The host of the smtp server" }),
    SMTP_PORT: port({ desc: "The port of the smtp server" }),
    SMTP_USERNAME: str({ desc: "The username of the smtp server" }),
    SMTP_PASSWORD: str({ desc: "The password of the smtp server" }),
  };
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
};

module.exports = validateEnv;
