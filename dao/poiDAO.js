'use strict'

var Promise = require('bluebird')
var MongoClient = require('mongodb').MongoClient
var assert = require('assert')


/**
 * Abstraction to get entities on database according to query, url
 * and collection
 * @param  {string} url - the url for database connection
 * @param  {object} query - object containing the mongoDB query
 * @param  {string} collection - name of database collection
 * @returns {Promise<Array>}
 */
this.insertItem = function(url, obj, collection) {
  return new Promise(function(resolve, reject) {
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err)

      db.collection(collection).insertOne(obj, function(err, r) {
        assert.equal(null, err)
        assert.equal(1, r.insertedCount)
        db.close()
        resolve(obj)
      })
    })
  })
}

/**
 * Abstraction to get entities on database according to query, url
 * and collection
 * @param  {string} url - the url for database connection
 * @param  {object} query - object containing the mongoDB query
 * @param  {string} collection - name of database collection
 * @returns {Promise<Array>}
 */
this.findItems = function(url, query, collection) {
  return new Promise(function(resolve, reject) {
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err)
      db.collection(collection).find(query).toArray(function(err, docs) {
        assert.equal(err, null)
        db.close()
        resolve(docs)
      })
    })
  }) 
}

module.exports = this
