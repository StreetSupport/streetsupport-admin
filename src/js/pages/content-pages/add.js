import '../../common'
require.ensure(['knockout', '../../models/content-pages/add'], (require) => {
  const ko = require('knockout')
  const Model = require('../../models/content-pages/add')
  const model = new Model()
  model.init()
  ko.applyBindings(model)
})
