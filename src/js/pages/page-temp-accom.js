import '../common'

require.ensure(['knockout', '../models/temporary-accommodation/list'], (require) => {
  const ko = require('knockout')
  const Model = require('../models/temporary-accommodation/list')
  const model = new Model()
  ko.applyBindings(model)

  model.init()
})

