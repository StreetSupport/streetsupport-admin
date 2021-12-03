import '../../common'
require.ensure(['knockout', '../../models/parent-scenarios/add'], (require) => {
  const ko = require('knockout')
  const Model = require('../../models/parent-scenarios/add')
  const model = new Model()
  ko.applyBindings(model)
})
