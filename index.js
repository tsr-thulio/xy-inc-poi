'use strict'

var express = require('express')
var bodyParser = require('body-parser')
var Types = require('./Types')
var swaggerUi = require('swaggerize-ui')
var url = 'mongodb://localhost:27017/xy-inc';

var app = express()

app.set('types', new Types())
app.set('dbUrl', url)
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json({limit: '3mb'}))
app.use(express.static('./public'))
app.use('/swagger-ui', swaggerUi({docs: './public/swagger.yaml'}))
app.use(require('./controller/apiController'))

app.listen(process.env.port || 9000, function () {
  console.log('Server initialized')
})
