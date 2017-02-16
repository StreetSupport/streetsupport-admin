import '../common'

require.ensure(['knockout', '../models/temporary-accommodation/reviews/app'], function (require) {
  var ko = require('knockout')
  var Model = require('../models/temporary-accommodation/reviews/app')
  ko.applyBindings(new Model())
})
