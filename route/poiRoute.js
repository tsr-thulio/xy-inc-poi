'use strict'

var express = require('express')
var router = express.Router()
var poiController = require('../controller/poiController')

/**
 * Router to redirect the main page to swagger documentation
 */
router.get('/', function(req, resp) {
  resp.redirect('/swagger-ui/?url=..%2Fswagger.yaml#/')
})

/**
 * Router to make a POST and create POIs on data base
 */
router.post('/poi', function(req, resp) {
  poiController.add(req, resp)
})

/**
 * Router to make a GET and return all POIs
 */
router.get('/poi', function(req, resp) {
  poiController.getAll(req, resp)
})

/**
 * Router to make a GET and return POIs depending on proximity
 */
router.get('/poi/proximity', function(req, resp) {
  poiController.getByProximity(req, resp)
})

module.exports = router
