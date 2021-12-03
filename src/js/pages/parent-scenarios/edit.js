import '../../common'
require.ensure(['knockout', '../../models/parent-scenarios/edit'], (require) => {
  const ko = require('knockout')
  const Model = require('../../models/parent-scenarios/edit')
  const model = new Model()
  model.init()
  ko.applyBindings(model)
})
