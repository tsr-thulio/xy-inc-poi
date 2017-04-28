'use strict'

var express = require('express')
var request = require('supertest')
var bodyParser = require('body-parser')
var apiController = require('../controller/apiController')

describe('API controller tests', function () {
  var app
  beforeEach(function () {
    app = express()
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({extended: true}))
      .use(apiController)
  })

  describe('POIs operations', function() {

    describe('GET', function() {
      it('Should return 501 when call get all opperation', function (done) {
        request(app)
          .get('/poi')
          .expect(501)
          .end(done)
      })

      it('Should return 501 when call get by proximity opperation', function (done) {
        request(app)
          .get('/poi/proximity')
          .expect(501)
          .end(done)
      })
    })

    describe('POST', function() {
      it('Should return 501 when call post opperation', function (done) {
        request(app)
          .post('/poi')
          .send()
          .expect(501)
          .end(done)
      })
    })
  })
})
