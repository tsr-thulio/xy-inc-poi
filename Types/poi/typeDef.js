'use strict'

var POI = exports

/**
 * @typedef {Object} api.bctEvent
 */
POI.schema = {
  id: 'poi.typeDef',
  type: 'object',
  required: ['x', 'y', 'name'],
  properties: {
    x: {type: 'integer', minimum: 0},
    y: {type: 'integer', minimum: 0},
    name: {type: 'string'}
  }
}
