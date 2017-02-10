import '../common'
require.ensure(['knockout', '../models/temporary-accommodation/edit'], (require) => {
  const ko = require('knockout')
  const Model = require('../models/temporary-accommodation/edit')
  const model = new Model()
  model.init()
  ko.applyBindings(model)
})
