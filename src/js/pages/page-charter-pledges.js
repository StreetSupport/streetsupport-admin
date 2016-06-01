import '../common'

require.ensure(['knockout', '../models/charter-pledges/ListCharterPledgesModel'], function (require) {
  var ko = require('knockout')
  var Model = require('../models/charter-pledges/ListCharterPledgesModel')
  ko.applyBindings(new Model())
})
