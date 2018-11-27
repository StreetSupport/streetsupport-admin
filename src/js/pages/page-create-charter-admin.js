import '../common'

require.ensure(['knockout', '../models/users/create-charter-admin'], function (require) {
  var ko = require('knockout')
  var Model = require('../models/users/create-charter-admin')
  const model = new Model()
  model.init()
  ko.applyBindings(model)
})
