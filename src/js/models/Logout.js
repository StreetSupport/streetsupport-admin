var ajax = require('basic-ajax')
var endpoints = require('../api-endpoints')
var adminUrls = require('../admin-urls')
var browser = require('../browser')
var cookies = require('../cookies')
var ko = require('knockout')
var _ = require('lodash')
var BaseViewModel = require('./BaseViewModel')

function LogoutModel () {
  var self = this

  var self = this
  var sessionToken = cookies.get('session-token')

  ajax.delete(self.endpointBuilder.sessions(sessionToken).build(),
    self.headers(sessionToken),
    {})
  .then(function (result) {
    cookies.unset('session-token')
    cookies.unset('auth-claims')
  }, function (error) {
    self.setErrors(error)
    self.isSubmitting = false
  })
}

LogoutModel.prototype = new BaseViewModel()

module.exports = LogoutModel
