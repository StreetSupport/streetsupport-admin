import '../common'

require.ensure(['knockout', '../models/accommodation/reviews/details'], function (require) {
  var ko = require('knockout')
  var Model = require('../models/accommodation/reviews/details')
  ko.applyBindings(new Model())
})
