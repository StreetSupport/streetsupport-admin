import '../common'

require.ensure(['knockout', '../models/service-provider-services/EditServiceProviderService'], function (require) {
  var ko = require('knockout')
  var Model = require('../models/service-provider-services/EditServiceProviderService')
  ko.applyBindings(new Model())
})
