import '../common'

require.ensure(['knockout', '../models/Auth/Logout'], function (require) {
  var ko = require('knockout')
  var Model = require('../models/Auth/Logout')
  ko.applyBindings(new Model())
})
