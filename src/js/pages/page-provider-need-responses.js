import '../common'

require.ensure(['knockout', '../models/service-provider-needs/responses/ListModel'], function (require) {
  var ko = require('knockout')
  var Model = require('../models/service-provider-needs/responses/ListModel')
  ko.applyBindings(new Model())
})
