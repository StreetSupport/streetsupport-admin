import '../common'

require.ensure(['knockout', '../models/accommodation/reviews/list'], function (require) {
  var ko = require('knockout')
  var Model = require('../models/accommodation/reviews/list')
  ko.applyBindings(new Model())
})
