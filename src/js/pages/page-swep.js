import '../common'

require.ensure(['knockout', '../models/cities/SwepModel'], function (require) {
  const ko = require('knockout')
  const Model = require('../models/cities/SwepModel')
  const model = new Model()
  ko.applyBindings(model)
  model.init()
})
