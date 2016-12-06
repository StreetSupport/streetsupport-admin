import '../common'

require.ensure(['knockout', '../models/service-provider-needs/EditCategories'], (require) => {
  var ko = require('knockout')
  var Model = require('../models/service-provider-needs/EditCategories')
  ko.applyBindings(new Model())
})
