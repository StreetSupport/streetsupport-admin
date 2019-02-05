import '../common'

require.ensure(['knockout', '../models/cities/ListingModel'], function (require) {
  const ko = require('knockout')
  const Model = require('../models/cities/ListingModel')
  const model = new Model()
  ko.applyBindings(model)
  model.init()
})
