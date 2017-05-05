'use strict'

var Promise = require('bluebird')
var poiDAO = require('../dao/poiDAO')

/**
 * Function to add a new POI on database
 */
this.add = function(req, resp) {
  Promise.resolve()
  .then(function() {
    var Types = req.app.get('types')
    var poi = Types.create('poi.typeDef', req.body)
    return poi
  })
  .then(function(poiObj) {
    return poiDAO.insertItem(poiObj)
  })
  .then(function(doc) {
    resp.status(201)
    resp.json(doc)
  })
  .catch(function(err) {
    resp.status(err.statusCode || 500)
    resp.json({status: err.statusCode || 500, message: err.message})
  })
}

/**
 * Function to get all POIs
 */
this.getAll = function(req, resp) {
  return Promise.resolve()
  .then(function() {
    var query = {}
    return poiDAO.findAll()
  })
  .then(function(items) {
    resp.status(200)
    resp.json(items)
  })
  .catch(function(err) {
    resp.status(err.statusCode || 500)
    resp.json({status: err.statusCode || 500, message: err.message})
  })
}

/**
 * Function to get POIs by proximity
 */
this.getByProximity = function(req, resp) {
  return Promise.resolve()
  .then(function() {
    validateQueryString(req.query.x, req.query.y, req.query.range)
    return req.query
  })
  .then(function(params) {
    return poiDAO.findByProximity(params)
  })
  .then(function(result) {
    resp.status(200)
    resp.json(result)
  })
  .catch(function(err) {
    resp.status(err.statusCode || 500)
    resp.json({status: err.statusCode || 500, message: err.message})
  })
}

/**
 * Validation of querystring coordinates
 * @param  {string} x string representing the x coordinate
 * @param  {string} y - string representing the y coordinate
 * @param  {string} range - string representing the y coordinate
 * @returns {Error} - if the values are not ok
 */
function validateQueryString(x, y, range) {
  if (x === undefined || range === undefined || y === undefined || isNaN(Number(x)) || isNaN(Number(y) || isNaN(range))) {
    var err = new Error('Coodinates parameter not informed or invalid on queryString')
    throw err
  }
}

module.exports = this
