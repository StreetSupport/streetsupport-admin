import '../common'

require.ensure(['knockout', '../models/accommodation/list'], (require) => {
  const ko = require('knockout')
  const Model = require('../models/accommodation/list')
  const model = new Model()
  ko.applyBindings(model)
})

