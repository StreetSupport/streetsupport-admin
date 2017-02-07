import '../common'

require.ensure(['knockout', '../models/temporary-accommodation/List'], (require) => {
  var ko = require('knockout')
  var Model = require('../models/temporary-accommodation/List')
  ko.applyBindings(new Model())
})
