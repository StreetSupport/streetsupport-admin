import '../common'

require.ensure(['knockout', '../models/service-providers/ServiceProviderDetails'], function (require) {
  var ko = require('knockout')
  var Model = require('../models/service-providers/ServiceProviderDetails')
  ko.applyBindings(new Model())
})
