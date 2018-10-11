import '../../common'
require.ensure(['knockout', '../../models/advice/add'], (require) => {
  const ko = require('knockout')
  const Model = require('../../models/advice/add')
  const model = new Model()
  model.init()
  ko.applyBindings(model)
})
