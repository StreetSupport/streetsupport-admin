import '../common'

require.ensure(['knockout', '../models/offers-of-items/ContactAboutOfferModel'], function (require) {
  var ko = require('knockout')
  var Model = require('../models/offers-of-items/ContactAboutOfferModel')
  ko.applyBindings(new Model())
})
