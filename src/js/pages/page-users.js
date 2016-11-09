import '../common'

require.ensure(['knockout', '../models/users/Users'], function (require) {
  var ko = require('knockout')
  var Model = require('../models/users/Users')
  ko.applyBindings(new Model())
})
