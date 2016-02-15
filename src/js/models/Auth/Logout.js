var ajax = require('basic-ajax')
var cookies = require('../../cookies')
var BaseViewModel = require('../BaseViewModel')

function LogoutModel () {
  var self = this

  var sessionToken = cookies.get('session-token')

  ajax.delete(self.endpointBuilder.sessions(sessionToken).build(),
    self.headers(sessionToken),
    {})
  .then(function (result) {
    cookies.unset('session-token')
    cookies.unset('auth-claims')
  }, function () {
    self.isSubmitting = false
  })
}

LogoutModel.prototype = new BaseViewModel()

module.exports = LogoutModel
