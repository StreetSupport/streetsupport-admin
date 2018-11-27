import '../common'

require.ensure(['knockout', '../models/users/create-accom-review-admin'], function (require) {
  var ko = require('knockout')
  var Model = require('../models/users/create-accom-review-admin')
  const model = new Model()
  model.init()
  ko.applyBindings(model)
})
