import '../../common'
require.ensure(['knockout', '../../models/advice/listing'], (require) => {
  const ko = require('knockout')
  const Model = require('../../models/advice/listing')
  const model = new Model()
  ko.applyBindings(model)
})
