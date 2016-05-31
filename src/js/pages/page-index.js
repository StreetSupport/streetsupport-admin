import '../common'

require.ensure(['knockout', '../models/Index'], function (require) {
  var ko = require('knockout')
  var Model = require('../models/Index')
  ko.applyBindings(new Model())
})
