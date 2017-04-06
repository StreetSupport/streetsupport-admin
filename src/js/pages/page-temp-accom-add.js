import '../common'
require.ensure(['knockout', '../models/accommodation/add'], (require) => {
  const ko = require('knockout')
  const Model = require('../models/accommodation/add')
  const model = new Model()
  model.init()
  ko.applyBindings(model)
})
