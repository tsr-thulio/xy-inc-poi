'use strict'

var express = require('express')
var router = express.Router()
var Promise = require('bluebird')
var MongoClient = require('mongodb').MongoClient
var assert = require('assert')
var url = 'mongodb://localhost:27017/xy-inc';

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
  .catch(function(err) {
    resp.status(err.statusCode)
    resp.json({status: err.statusCode, message: err.message})
  })
  .then(function(poi) {
    MongoClient.connect(url, function(err, db) {
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
})

/**
 * Router to make a GET and return all POIs
 */
router.get('/poi', function(req, resp) {
  return Promise.resolve()
  .then(function() {
    return findItems({}, 'poi')
  })
  .then(function(items) {
    resp.status(200)
    resp.json(items)
  })
})

/**
 * Router to make a GET and return POIs depending on proximity
 */
router.get('/poi/proximity', function(req, resp) {
  return Promise.resolve()
  .then(function() {
    var query = {
      x: {
        $gte: Number(req.query.x) - 10,
        $lte: Number(req.query.x) + 10
      },
      y: {
        $gte: Number(req.query.y) - 10,
        $lte: Number(req.query.y) + 10
      }
    }
    return query
  })
  .then(function(query) {
    return findItems(query, 'poi')
  })
  .then(function(result) {
    resp.status(200)
    resp.json(result)
  })
})

function findItems(query, collection) {
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

module.exports = router
