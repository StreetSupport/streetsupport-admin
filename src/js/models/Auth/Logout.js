var ajax = require('../../ajax')
var cookies = require('../../cookies')
var BaseViewModel = require('../BaseViewModel')
var nav = require('../../nav')

function LogoutModel () {
  var self = this

  var sessionToken = cookies.get('session-token')
  const endpoint = self.endpointBuilder.sessions(sessionToken).build()

  ajax.delete(endpoint,
    self.headers(sessionToken))
  .then(function (result) {
    cookies.unset('session-token')
    cookies.unset('auth-claims')
    nav.disableForbiddenLinks()
  }, function () {
    self.isSubmitting = false
  })
}

LogoutModel.prototype = new BaseViewModel()

module.exports = LogoutModel
