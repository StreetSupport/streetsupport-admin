import '../common'

require.ensure(['knockout', '../models/offers-of-items/ListModel'], function (require) {
  var ko = require('knockout')
  var Model = require('../models/offers-of-items/ListModel')
  ko.applyBindings(new Model())
})
