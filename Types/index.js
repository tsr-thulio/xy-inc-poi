'use strict'

var _ = require('lodash')
var Ajv = require('ajv')

/**
 * Provides access to data types to validate and convert data
 * @returns {*}
 * @constructor
 */
var Types = function () {
  this.validator = new Ajv()
  this.defs = {}
  this._init()
}

Types.prototype.validator = null

Types.prototype.defs = null

/**
 * Validate data with json-schema, and make a deep clone
 * @param {string} id ID of json-schema
 * @param {*} data Data to validate
 * @returns {*} Deep clone of the data
 * @throws Type not found
 * @throws Validation error
 */
Types.prototype.create = function (id, data) {
  if (!this.defs[id]) {
    throw makeHttpError(new TypeError('Type not found: [' + id + ']'), 500)
  }
  if (!this.validator.validate(id, data)) {
    throw makeHttpError(new TypeError('Data validation failed: ' + this.validator.errorsText()), 400)
  }
  return _.cloneDeep(data)
}

/**
 * Request files in type sets (subdirectories) to save reference and register schema in validator
 * @private
 */
Types.prototype._init = function () {
  var that = this
  require('require-directory')(module, {
    visit: function (obj) {
      that.validator.addSchema(obj.schema)
      that.defs[obj.schema.id] = obj
      if (obj.formats) {
        Object.keys(obj.formats).map(function (formatName) {
          that.validator.addFormat(formatName, obj.formats[formatName])
        })
      }
    }
  })
}

function makeHttpError (error, statusCode) {
  error.internalError = error.message // clone message to maybe set custom message
  error.statusCode = statusCode
  return error
}

exports = module.exports = Types
