import '../../common'
require.ensure(['knockout', '../../models/content-pages/listing'], (require) => {
  const ko = require('knockout')
  const Model = require('../../models/content-pages/listing')
  const model = new Model()
  ko.applyBindings(model)
})
