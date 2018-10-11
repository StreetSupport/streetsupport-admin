import '../../common'
require.ensure(['knockout', '../../models/advice/edit'], (require) => {
  const ko = require('knockout')
  const Model = require('../../models/advice/edit')
  const model = new Model()
  model.init()
  ko.applyBindings(model)
})
