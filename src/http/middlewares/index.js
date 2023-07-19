module.exports = {
    apiErrorsMiddleware: require('./apiErrors.middleware'),
    apiValidatorMiddleware: require('./apiValidator.middleware'),
    userAuthMiddleware: require('./userAuth.middleware'),
    adminAuthMiddleware: require('./adminAuth.middleware'),
    idParamValidatorMiddleware: require('./idParamValidator.middleware'),
}