import '../common'

require.ensure(['knockout', '../models/ServiceProviders'], function (require) {
  var ko = require('knockout')
  var Model = require('../models/ServiceProviders')
  ko.applyBindings(new Model())
})
