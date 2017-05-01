'use strict'

var express = require('express')
var expect = require('chai').expect
var request = require('supertest')
var bodyParser = require('body-parser')
var apiController = require('../controller/apiController')
var MongoClient = require('mongodb').MongoClient
var Types = require('../Types')
var url = 'mongodb://localhost:27017/xy-inc-test';

var app = express()
  .set('dbUrl', url)
  .set('types', new Types())
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({extended: true}))
  .use(apiController)

function removeData(item) {
  MongoClient.connect(url, function(err, db) {
    db.collection('poi').deleteOne(item, function(err, r) {
      db.close()
    })
  })
}

function insertData(poi) {
  MongoClient.connect(url, function(err, db) {
    db.collection('poi').insertOne(poi, function(err, r) {
      db.close()
    })
  })
}

describe('API controller tests', function () {

  beforeEach(function() {
    this.timeout(5000)
  })

  describe('POIs operations', function() {
    describe('GET ALL', function() {
      beforeEach(function() {
        insertData({x: 1, y: 2, name: 'TestData'})
      })
      afterEach(function() {
        removeData({x:1, y:2, name: 'TestData'})
      })

      it('Should return 200 and get the all POIs on data base', function (done) {
        request(app)
          .get('/poi')
          .expect(200)
          .expect(function(req) {
            expect(req.body.length).to.equal(1)
            expect(req.body[0].x).to.equal(1)
            expect(req.body[0].y).to.equal(2)
            expect(req.body[0].name).to.equal('TestData')
          })
          .end(done)
      })
    })

    describe('GET BY PROXIMITY', function() {
      beforeEach(function() {
        insertData({x: 15, y: 15, name: 'TestData1'})
        insertData({x: 30, y: 30, name: 'TestData2'})
        insertData({x: 40, y: 40, name: 'TestData3'})
      })
      afterEach(function() {
        removeData({x: 15, y: 15, name: 'TestData1'})
        removeData({x: 30, y: 30, name: 'TestData2'})
        removeData({x: 40, y: 40, name: 'TestData3'})
      })

      it('Should return 200 with two POI on range', function (done) {
        request(app)
          .get('/poi/proximity?x=35&y=35')
          .expect(function(req) {
            expect(req.body.length).to.equal(2)
            expect(req.body[0].x).to.equal(30)
            expect(req.body[0].name).to.equal('TestData2')
            expect(req.body[1].x).to.equal(40)
            expect(req.body[1].name).to.equal('TestData3')
          })
          .expect(200)
          .end(done)
      })

      it('Should return 200 with empty array', function (done) {
        request(app)
          .get('/poi/proximity?x=1&y=4')
          .expect(function(req) {
            expect(req.body.length).to.equal(0)
          })
          .expect(200)
          .end(done)
      })

      it('Should return 500 error if no querystring was informed', function (done) {
        request(app)
          .get('/poi/proximity')
          .expect(/Coodinates parameter not informed or invalid on queryString/)
          .expect(500)
          .end(done)
      })

      it('Should return 500 error if the querystring is invalid', function (done) {
        request(app)
          .get('/poi/proximity?x=abc&y=1')
          .expect(/Coodinates parameter not informed or invalid on queryString/)
          .expect(500)
          .end(done)
      })
    })
  
    describe('POST', function() {
      afterEach(function() {
        removeData({x: 5, y: 5, name: 'test'})
      })

      it('Should return error 400 when call post opperation with invalid body', function (done) {
        request(app)
          .post('/poi')
          .send({z: 1, w: 2})
          .expect(/Data validation failed/)
          .expect(400)
          .end(done)
      })

      it('Should return error 400 when call post opperation with negative coordinates', function (done) {
        request(app)
          .post('/poi')
          .send({x: -100, y: -2, name: 'invalid'})
          .expect(/Data validation failed/)
          .expect(400)
          .end(done)
      })

      it('Should return error 400 when call post opperation with non integer coordinates', function (done) {
        request(app)
          .post('/poi')
          .send({x: 10.3, y: 2, name: 'invalid'})
          .expect(/Data validation failed/)
          .expect(400)
          .end(done)
      })

      it('Should return error 200 and insert on data base', function (done) {
        request(app)
          .post('/poi')
          .send({x: 5, y: 5, name: 'test'})
          .expect({x: 5, y: 5, name: 'test'})
          .expect(201)
          .end(done)
      })
    })
  })
})
