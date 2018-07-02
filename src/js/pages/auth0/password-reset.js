import '../../common'

require.ensure(['knockout', '../../models/auth0/password-reset'], function (require) {
  var ko = require('knockout')
  var Model = require('../../models/auth0/password-reset')
  ko.applyBindings(new Model())
})
