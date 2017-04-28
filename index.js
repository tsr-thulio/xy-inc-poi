'use strict'

var express = require('express')

var app = express()

app.listen(process.env.port || 9000, function () {
  console.log('Server initialized')
})
