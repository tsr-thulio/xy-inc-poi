'use strict'

var express = require('express')
var router = express.Router()

/**
 * Router to make a POST and create POIs on data base
 */
router.post('/poi', function(req, resp) {
  resp.status(501)
  resp.send()
})

/**
 * Router to make a GET and return all POIs
 */
router.get('/poi', function(req, resp) {
  resp.status(501)
  resp.send()
})

/**
 * Router to make a GET and return POIs depending on proximity
 */
router.get('/poi/proximity', function(req, resp) {
  resp.status(501)
  resp.send()
})

module.exports = router
