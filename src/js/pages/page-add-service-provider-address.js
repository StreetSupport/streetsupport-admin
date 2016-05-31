import '../common'

require.ensure(['knockout', '../models/service-provider-addresses/AddServiceProviderAddress'], function (require) {
  var ko = require('knockout')
  var Model = require('../models/service-provider-addresses/AddServiceProviderAddress')
  ko.applyBindings(new Model())
})
