import '../common'

require.ensure(['knockout', '../models/temporary-accommodation/list'], (require) => {
  var ko = require('knockout')
  var Model = require('../models/temporary-accommodation/list')
  ko.applyBindings(new Model())
})
