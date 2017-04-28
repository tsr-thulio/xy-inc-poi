'use strict'

var express = require('express')
var request = require('supertest')
var bodyParser = require('body-parser')
var apiController = require('../controller/apiController')
var Types = require('../Types')


describe('API controller tests', function () {
  var app
  beforeEach(function () {
    app = express()
      .set('types', new Types())
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({extended: true}))
      .use(apiController)
  })

  describe('POIs operations', function() {

    // describe('GET', function() {
    //   it('Should return 501 when call get all opperation', function (done) {
    //     request(app)
    //       .get('/poi')
    //       .expect(501)
    //       .end(done)
    //   })

    //   it('Should return 501 when call get by proximity opperation', function (done) {
    //     request(app)
    //       .get('/poi/proximity')
    //       .expect(501)
    //       .end(done)
    //   })
    // })

    describe('POST', function() {
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
    })
  })
})
