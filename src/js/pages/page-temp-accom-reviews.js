import '../common'

require.ensure(['knockout', '../models/accommodation/reviews/app'], function (require) {
  var ko = require('knockout')
  var Model = require('../models/accommodation/reviews/app')
  ko.applyBindings(new Model())
})
