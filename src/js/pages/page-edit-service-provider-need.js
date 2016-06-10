import '../common'

require.ensure(['knockout', '../models/service-provider-needs/EditServiceProviderNeed'], function (require) {
  var ko = require('knockout')
  var Model = require('../models/service-provider-needs/EditServiceProviderNeed')
  ko.applyBindings(new Model())
})
