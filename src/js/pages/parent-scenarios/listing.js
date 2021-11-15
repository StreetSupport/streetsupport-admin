import '../../common'
require.ensure(['knockout', '../../models/parent-scenarios/listing'], (require) => {
  const ko = require('knockout')
  const Model = require('../../models/parent-scenarios/listing')
  const model = new Model()
  ko.applyBindings(model)
})
