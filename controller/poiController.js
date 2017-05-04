'use strict'

var Promise = require('bluebird')
var poiDAO = require('../dao/poiDAO')
var MAX_PROXIMITY_RANGE = 10
var DB_COLLECTION = 'poi'

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
    return poiDAO.insertItem(req.app.get('dbUrl'), poiObj, DB_COLLECTION)
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
    return poiDAO.findItems(req.app.get('dbUrl'), query, DB_COLLECTION)
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
    validateQueryString(req.query.x, req.query.y)
    return createProximityQuery(req.query.x, req.query.y)
  })
  .then(function(query) {
    return poiDAO.findItems(req.app.get('dbUrl'), query, DB_COLLECTION)
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
 * Generate querystring for mongoDB
 * @param  {string} x - string representing the x coordinate
 * @param  {string} y - string representing the y coordinate
 * @returns {object} - the mongoDb query created
 */
function createProximityQuery(x, y) {
  var query = {
      x: {
        $gte: Number(x) - MAX_PROXIMITY_RANGE,
        $lte: Number(x) + MAX_PROXIMITY_RANGE
      },
      y: {
        $gte: Number(y) - MAX_PROXIMITY_RANGE,
        $lte: Number(y) + MAX_PROXIMITY_RANGE
      }
    }
  return query
}

/**
 * Validation of querystring coordinates
 * @param  {string} x string representing the x coordinate
 * @param  {string} y - string representing the y coordinate
 * @returns {Error} - if the values are not ok
 */
function validateQueryString(x, y) {
  if (x === undefined || y === undefined || isNaN(Number(x)) || isNaN(Number(y))) {
    var err = new Error('Coodinates parameter not informed or invalid on queryString')
    throw err
  }
}

module.exports = this
