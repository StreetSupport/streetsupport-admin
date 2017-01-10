import '../common'

require.ensure(['knockout', '../models/impact-updates/app'], function (require) {
  var ko = require('knockout')
  var Model = require('../models/impact-updates/app')
  ko.applyBindings(new Model())
})
