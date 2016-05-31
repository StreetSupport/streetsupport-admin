import '../common'

require.ensure(['knockout', '../models/ServiceProvider'], function (require) {
  var ko = require('knockout')
  var Model = require('../models/ServiceProvider')
  ko.applyBindings(new Model())
})
