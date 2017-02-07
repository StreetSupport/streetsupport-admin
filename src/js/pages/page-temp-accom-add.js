import '../common'

require.ensure(['knockout', '../models/temporary-accommodation/add'], (require) => {
  var ko = require('knockout')
  var Model = require('../models/temporary-accommodation/add')
  ko.applyBindings(new Model())
})
