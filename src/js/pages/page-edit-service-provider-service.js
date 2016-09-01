import '../common'

require.ensure(['knockout', '../models/service-provider-services/EditGroupedService'], function (require) {
  var ko = require('knockout')
  var Model = require('../models/service-provider-services/EditGroupedService')
  ko.applyBindings(new Model())
})
