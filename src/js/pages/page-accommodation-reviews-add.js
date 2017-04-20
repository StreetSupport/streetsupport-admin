import '../common'

require.ensure(['knockout', '../models/accommodation/reviews/add'], function (require) {
  var ko = require('knockout')
  var Model = require('../models/accommodation/reviews/add')
  ko.applyBindings(new Model())
})
