import '../common'

require.ensure(['knockout', '../models/volunteers/ContactVolunteerModel'], function (require) {
  var ko = require('knockout')
  var Model = require('../models/volunteers/ContactVolunteerModel')
  ko.applyBindings(new Model())
})
