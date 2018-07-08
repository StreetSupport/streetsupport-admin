import '../../common'

require.ensure(['knockout', '../../models/auth0/login'], function (require) {
  var ko = require('knockout')
  var Model = require('../../models/auth0/login')
  ko.applyBindings(new Model())
})
