import '../../common'

require.ensure(['knockout', '../../models/dashboard/app'], function (require) {
  var ko = require('knockout')
  var Model = require('../../models/dashboard/app')
  ko.applyBindings(new Model())
})
