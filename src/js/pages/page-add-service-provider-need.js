import '../common'

require.ensure(['knockout', '../models/service-provider-needs/AddServiceProviderNeed'], function (require) {
  var ko = require('knockout')
  var Model = require('../models/service-provider-needs/AddServiceProviderNeed')
  ko.applyBindings(new Model())
})
