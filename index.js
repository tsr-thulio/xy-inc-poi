'use strict'

var express = require('express')
var bodyParser = require('body-parser')
var Types = require('./Types')
var swaggerUi = require('swaggerize-ui')

var app = express()

app.set('types', new Types())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json({limit: '3mb'}))
app.use(express.static('./public'))
app.use('/swagger-ui', swaggerUi({docs: './public/swagger.yaml'}))
app.use(require('./route/poiRoute'))

app.listen(process.env.port || 9000, function () {
  console.log('Server initialized')
})
