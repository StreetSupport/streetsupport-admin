import '../common'

require.ensure(['knockout', '../models/ServiceProviderAddresses'], function (require) {
  var ko = require('knockout')
  var Model = require('../models/ServiceProviderAddresses')
  ko.applyBindings(new Model())
})
