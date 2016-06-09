import '../common'

require.ensure(['knockout', '../models/mailing-list/ListMembers'], function (require) {
  var ko = require('knockout')
  var Model = require('../models/mailing-list/ListMembers')
  ko.applyBindings(new Model())
})
