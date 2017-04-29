'use strict'

var express = require('express')
var router = express.Router()
var Promise = require('bluebird')
var MongoClient = require('mongodb').MongoClient
var assert = require('assert')

/**
 * Router to make a POST and create POIs on data base
 */
router.post('/poi', function(req, resp) {
  Promise.resolve()
  .then(function() {
    var Types = req.app.get('types')
    var poi = Types.create('poi.typeDef', req.body)
    return poi
  })
  .then(function(poi) {
    MongoClient.connect(req.app.get('dbUrl'), function(err, db) {
      assert.equal(null, err)

      db.collection('poi').insertOne(poi, function(err, r) {
        assert.equal(null, err)
        assert.equal(1, r.insertedCount)
        db.close()
      });
    });
    resp.status(200)
    resp.json(poi)
  })
  .catch(function(err) {
    resp.status(err.statusCode || 500)
    resp.json({status: err.statusCode || 500, message: err.message})
  })
})

/**
 * Router to make a GET and return all POIs
 */
router.get('/poi', function(req, resp) {
  return Promise.resolve()
  .then(function() {
    return findItems(req.app.get('dbUrl'), {}, 'poi')
  })
  .then(function(items) {
    resp.status(200)
    resp.json(items)
  })
  .catch(function(err) {
    resp.status(err.statusCode || 500)
    resp.json({status: err.statusCode || 500, message: err.message})
  })
})

/**
 * Router to make a GET and return POIs depending on proximity
 */
router.get('/poi/proximity', function(req, resp) {
  return Promise.resolve()
  .then(function() {
    validateQueryString(req.query.x, req.query.y)
    return createMongoDbQuery(req.query.x, req.query.y)
  })
  .then(function(query) {
    return findItems(req.app.get('dbUrl'), query, 'poi')
  })
  .then(function(result) {
    resp.status(200)
    resp.json(result)
  })
  .catch(function(err) {
    resp.status(err.statusCode || 500)
    resp.json({status: err.statusCode || 500, message: err.message})
  })
})

/**
 * Abstraction to get entities on database according to query, url
 * and collection
 * @param  {string} url - the url for database connection
 * @param  {object} query - object containing the mongoDB query
 * @param  {string} collection - name of database collection
 * @returns {Promise<Array>}
 */
function findItems(url, query, collection) {
  return new Promise(function(resolve, reject) {
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      db.collection(collection).find(query).toArray(function(err, docs) {
        assert.equal(err, null)
        db.close()
        resolve(docs)
      });
    });
  }) 
}

/**
 * Generate querystring for mongoDB
 * @param  {string} x - string representing the x coordinate
 * @param  {string} y - string representing the y coordinate
 * @returns {object} - the mongoDb query created
 */
function createMongoDbQuery(x, y) {
  var query = {
      x: {
        $gte: Number(x) - 10,
        $lte: Number(x) + 10
      },
      y: {
        $gte: Number(y) - 10,
        $lte: Number(y) + 10
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

module.exports = router
