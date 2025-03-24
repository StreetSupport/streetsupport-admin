import '../common'

require.ensure(['knockout', '../models/users/create-volunteer-admin'], function (require) {
  var ko = require('knockout')
  var Model = require('../models/users/create-volunteer-admin')
  const model = new Model()
  model.init()
  ko.applyBindings(model)
})
