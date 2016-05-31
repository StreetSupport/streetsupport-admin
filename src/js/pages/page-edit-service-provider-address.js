import '../common'

require.ensure(['knockout', '../models/service-provider-addresses/EditServiceProviderAddress'], function (require) {
  var ko = require('knockout')
  var Model = require('../models/service-provider-addresses/EditServiceProviderAddress')
  ko.applyBindings(new Model())
})
