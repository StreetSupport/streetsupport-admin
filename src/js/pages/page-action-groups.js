import '../common'

require.ensure(['knockout', '../models/action-groups/ListActionGroups'], (require) => {
  var ko = require('knockout')
  var Model = require('../models/action-groups/ListActionGroups')
  ko.applyBindings(new Model())
})
