import '../common'

require.ensure(['knockout', '../models/AddServiceProvider'], function (require) {
  var ko = require('knockout')
  var Model = require('../models/AddServiceProvider')
  ko.applyBindings(new Model())
})
