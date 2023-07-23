const _ = require("lodash");
const {
  apiValidatorMiddleware,
  idParamValidatorMiddleware,
  userAuthMiddleware,
} = require("../http/middlewares");
const userRoles = require("../constants/userRoles.constant");
const httpMethods = require("../constants/httpMethods.constant");
const response = require("../utils/response.utils");
const uplodaFileMiddleware = require("../http/middlewares/uploadFile.middleware");

class RouteBuilder {
  constructor({ path, method, apiValidator, controller, userRole } = {}) {
    if (path) this.setPath(path);
    if (method) this.setMethod(method);
    if (apiValidator) this.setApiValidator(apiValidator);
    if (controller) this.setController(controller);
    if (userRole) this.setUserRole(userRole);

    // idea:
    // set {basepath} on constructor and reuse builder for all routes
  }

  #path;
  #method;
  #apiValidatorMiddleware;
  #adminAuthMiddleware;
  #userAuthMiddleware;
  #idValidatorMiddleware;
  #fileUploadMiddleware;
  #responseHandler;
  #router = require("express").Router();

  static roles = userRoles;

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

  useIdValadator() {
    this.#idValidatorMiddleware = idParamValidatorMiddleware;
    return this;
  }

  setUserRole(userRole) {
    this.#validateUserRole(userRole);
    if (userRole === userRoles.ADMIN) {
      // this.#router.use(adminAuthMiddleware)
      throw new Error("adminAuthMiddleware not implemented");
    } else if (userRole === userRoles.USER)
      this.#userAuthMiddleware = userAuthMiddleware;
    return this;
  }

  #validateUserRole(userRole) {
    const targetUserRoles = Object.values(userRoles);
    if (!targetUserRoles.includes(userRole))
      throw new Error(
        `userRole should be one of userRoles, ${targetUserRoles.join(", ")}`
      );
  }

  setApiValidator(apiValidator) {
    this.#apiValidatorMiddleware = apiValidatorMiddleware(apiValidator);
    return this;
  }

  /**
   * @param {{fieldName:string, subDir:string, multerOptions:import("multer").Options}} options
   */
  addFileUpload({ fieldName, subDir, multerOptions }={}) {
    this.#fileUploadMiddleware = uplodaFileMiddleware({
      fieldName,
      subDir,
      ...multerOptions,
    });
    return this;
  }

  setController(controller) {
    this.#responseHandler = this.#createResponseHandler(controller);
    return this;
  }
  #createResponseHandler = (controller) => (req, res) => {
    // todo: when validator not set , remove handlerPrams.body / on build | or set getter and error if not set
    const handlerPrams = _.pick(req, ["ip", "query", "params", "body", "user", "file"]);
    // handlerPrams.id = handlerPrams?.params?.id;
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
      response: ({ data, code } = {}) => {
        return response(res, { code, data });
      },
      //get body : throw error if not set
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
      this.#idValidatorMiddleware,
      this.#apiValidatorMiddleware,
      this.#userAuthMiddleware,
      this.#adminAuthMiddleware,
      this.#fileUploadMiddleware,
    ].filter(Boolean);
  }
}

module.exports = RouteBuilder;
