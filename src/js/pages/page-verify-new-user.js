import '../common'

require.ensure(['knockout', '../models/Auth/VerifyUser'], function (require) {
  var ko = require('knockout')
  var Model = require('../models/Auth/VerifyUser')
  ko.applyBindings(new Model())
})
