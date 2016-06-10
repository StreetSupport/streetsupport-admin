import '../common'

require.ensure(['knockout', '../models/AddUser'], function (require) {
  var ko = require('knockout')
  var Model = require('../models/AddUser')
  ko.applyBindings(new Model())
})
