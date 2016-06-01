import '../common'

require.ensure(['knockout', '../models/volunteers/ListVolunteersModel'], function (require) {
  var ko = require('knockout')
  var Model = require('../models/volunteers/ListVolunteersModel')
  ko.applyBindings(new Model())
})
