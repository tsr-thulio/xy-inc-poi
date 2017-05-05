'use strict'

var Promise = require('bluebird')
var MongoClient = require('mongodb').MongoClient
var assert = require('assert')
var COLLECTION_NAME = 'poi'
var db

MongoClient.connect(process.env.DB_URL, function(err, conn) {
  assert.equal(null, err)
  db = conn
})

/**
 * Abstraction to insert entities on database
 * @param  {object} obj - object to persist
 * @returns {Promise<Object>}
 */
this.insertItem = function(obj) {
  return new Promise(function(resolve, reject) {
    db.collection(COLLECTION_NAME).insertOne(obj, function(err, r) {
      assert.equal(null, err)
      assert.equal(1, r.insertedCount)
      resolve(obj)
    })
  })
}

/**
 * Abstraction to get all entities on database
 * @returns {Promise<Array>}
 */
this.findAll = function() {
  return new Promise(function(resolve, reject) {
    db.collection(COLLECTION_NAME).find({}).toArray(function(err, docs) {
      assert.equal(err, null)
      resolve(docs)
    })
  }) 
}

/**
 * Abstraction to get entities on database according to query
 * @param  {object} params - object containing the mongoDB params for query
 * @returns {Promise<Array>}
 */
this.findByProximity = function(params) {
  return new Promise(function(resolve, reject) {
    var query = createProximityQuery(params)
    db.collection(COLLECTION_NAME).find(query).toArray(function(err, docs) {
      assert.equal(err, null)
      resolve(docs)
    })
  }) 
}

/**
 * Generate querystring for mongoDB
 * @param  {object} params - object containing the x, y and range params for query
 * @returns {object} - the mongoDb query created
 */
function createProximityQuery(params) {
  var query = {
      x: {
        $gte: Number(params.x) - Number(params.range),
        $lte: Number(params.x) + Number(params.range)
      },
      y: {
        $gte: Number(params.y) - Number(params.range),
        $lte: Number(params.y) + Number(params.range)
      }
    }
  return query
}

module.exports = this
