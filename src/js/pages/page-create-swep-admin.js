import '../common'

require.ensure(['knockout', '../models/users/create-swep-admin'], function (require) {
  var ko = require('knockout')
  var Model = require('../models/users/create-swep-admin')
  const model = new Model()
  model.init()
  ko.applyBindings(model)
})
