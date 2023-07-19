const _ = require('lodash')
const {
  adminAuthMiddleware,
  apiErrorsMiddleware: apiErrorsMiddleware,
  apiValidatorMiddleware,
  idParamValidatorMiddleware,
  userAuthMiddleware,
} = require("../http/middlewares");
const userTypes = require("../constants/userTypes.constant");
const httpMethods = require("../constants/httpMethods.constant");
const response =require('../utils/response.utils')

class RouteBuilder {
  constructor({
    path,
    method,
    apiValidator,
    controller,
    userType,
  }={}) {
    if(path)this.setPath(path);
    if(method) this.setMethod(method);
    if(apiValidator) this.setApiValidator(apiValidator);
    if(controller)this.setController(controller);
    if(userType) this.setUserType(userType);
  }
  #controller;
  #path;
  #method;
  #apiValidatorMiddleware;
  #useAdminAuthMiddleware;
  #useUserAuthMiddleware;
  #responseHandler;
  #router = require("express").Router();

  setPath(path) {
    this.#validatePath(path);
    this.#path = path;
    return this;
  }

  #validatePath(path) {
    if (path[0] !== "/") throw new Error("path should start with /");
    if (path.length > 1 && path[path.length - 1] === "/")
      throw new Error("path should not end with / when not root");
  }

  setMethod(method) {
    this.#validateMethod(method);
    this.#method = method;
    return this;
  }

  #validateMethod(method) {
    const allowedMethods = Object.values(httpMethods);
    if (!allowedMethods.includes(method))
      throw new Error("method should be one of get, post, put, delete");
  }

  useIdValodator() {
    this.#router.use(idParamValidatorMiddleware);
    return this;
  }

  setUserType(userType) {
    this.#validateUserType(userType);
    if (userType === userTypes.ADMIN) this.#router.use(adminAuthMiddleware);
    else if (userType === userTypes.USER) this.#router.use(userAuthMiddleware);
    return this;
  }

  #validateUserType(userType) {
    const targetUserTypes = Object.values(userTypes);
    if (!targetUserTypes.includes(userType))
      throw new Error(
        `userType should be one of userTypes, ${targetUserTypes.join(", ")}`
      );
  }

  setApiValidator(apiValidator) {
    this.#apiValidatorMiddleware = apiValidatorMiddleware(apiValidator);
    return this;
  }

  // setAllowedRoles() { }

  setController(controller) {
    this.#responseHandler = this.#createResponseHandler(controller);
    return this;
  }
  #createResponseHandler = (controller) => (req, res) => {
    const handlerPrams = _.pick(req, ["ip", "query", "params", "body", "user"]);
    return controller({
      ...handlerPrams,
      header: {
        get: (headerName) => {
          return reg.get(headerName);
        },
        set: (headerName, value) => {
          res.set(headerName, value);
        },
      },
      response: ({ data, code }={}) => {
        return response(res, { code, data });
      },
    });
  };

  build() {
    this.#verifyImplementRequirements();
    const middlewares = this.#getAllMiddlewares();
    this.#router[this.#method](
      this.#path,
      ...middlewares,
      this.#responseHandler
    );
    return this.#router;
  }

  #verifyImplementRequirements() {
    if (!this.#responseHandler) throw new Error("controller is not set");
    if (!this.#path) throw new Error("path is not set");
    if (!this.#method) throw new Error("method is not set");
  }

  #getAllMiddlewares() {
    return [
      this.#apiValidatorMiddleware,
      this.#useUserAuthMiddleware,
      this.#useAdminAuthMiddleware,
    ].filter(Boolean);
  }
}

module.exports = RouteBuilder;
