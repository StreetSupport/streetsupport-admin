import '../common'
require.ensure(['knockout', '../models/accommodation/edit'], (require) => {
  const ko = require('knockout')
  const Model = require('../models/accommodation/edit')
  const model = new Model()
  model.init()
  ko.applyBindings(model)
})
