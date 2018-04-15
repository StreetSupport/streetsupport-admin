import '../common'

require.ensure(['knockout', '../models/users/create-super-admin'], function (require) {
  var ko = require('knockout')
  var Model = require('../models/users/create-super-admin')
  const model = new Model()
  model.init()
  ko.applyBindings(model)
})
