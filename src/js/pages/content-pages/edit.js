import '../../common'
require.ensure(['knockout', '../../models/content-pages/edit'], (require) => {
  const ko = require('knockout')
  const Model = require('../../models/content-pages/edit')
  const model = new Model()
  model.init()
  ko.applyBindings(model)
})
