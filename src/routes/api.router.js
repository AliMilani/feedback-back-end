const router = require('express').Router()
const notImplementedRouter = require('./notImpelemented.router')
const v1Router = require('./v1')

router.use('/v1', v1Router) 
router.use('/*', notImplementedRouter)

module.exports = router