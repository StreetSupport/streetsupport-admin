import '../common'

require.ensure(['knockout', '../models/volunteers/ShareVolunteerModel'], function (require) {
  var ko = require('knockout')
  var Model = require('../models/volunteers/ShareVolunteerModel')
  ko.applyBindings(new Model())
})
