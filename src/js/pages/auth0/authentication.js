import '../../common'

require.ensure(['knockout', '../../models/auth0/authentication'], function (require) {
  var ko = require('knockout')
  var Model = require('../../models/auth0/authentication')
  ko.applyBindings(new Model())
})
