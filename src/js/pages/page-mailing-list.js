import '../common'

require.ensure(['knockout', '../models/mailing-list/ListMembersModel'], function (require) {
  var ko = require('knockout')
  var Model = require('../models/mailing-list/ListMembersModel')
  ko.applyBindings(new Model())
})
