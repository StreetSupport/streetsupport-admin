import '../common'

require.ensure(['knockout', '../models/users/create-accom-provider-admin'], function (require) {
  var ko = require('knockout')
  var Model = require('../models/users/create-accom-provider-admin')
  const model = new Model()
  model.init()
  ko.applyBindings(model)
})
