import '../common'

require.ensure(['knockout', '../models/offers-of-items/ShareOfferModel'], function (require) {
  var ko = require('knockout')
  var Model = require('../models/offers-of-items/ShareOfferModel')
  ko.applyBindings(new Model())
})
