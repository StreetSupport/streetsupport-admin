import '../common'

require.ensure(['knockout', '../models/Auth/Login'], function (require) {
  var ko = require('knockout')
  var Model = require('../models/Auth/Login')
  ko.applyBindings(new Model())
})
