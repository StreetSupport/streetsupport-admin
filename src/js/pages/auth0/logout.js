import '../../common'

require.ensure(['knockout', '../../models/auth0/logout'], function (require) {
  var ko = require('knockout')
  var Model = require('../../models/auth0/logout')
  ko.applyBindings(new Model())
})
