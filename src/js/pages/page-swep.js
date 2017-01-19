import '../common'

require.ensure(['knockout', '../models/cities/SwepModel'], function (require) {
  var ko = require('knockout')
  var Model = require('../models/cities/SwepModel')
  ko.applyBindings(new Model())
})
