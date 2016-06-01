import '../common'

require.ensure(['knockout', '../models/service-provider-services/AddServiceProviderService'], function (require) {
  var ko = require('knockout')
  var Model = require('../models/service-provider-services/AddServiceProviderService')
  ko.applyBindings(new Model())
})
