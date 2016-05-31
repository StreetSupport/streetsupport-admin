import '../common'

require.ensure(['knockout', '../models/ServiceProviderServices'], function (require) {
  var ko = require('knockout')
  var Model = require('../models/ServiceProviderServices')
  ko.applyBindings(new Model())
})
