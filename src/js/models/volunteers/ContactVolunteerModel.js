var BaseViewModel = require('../BaseViewModel')
var ajax = require('../../ajax')
var browser = require('../../browser')
var cookies =   require('../../cookies')
var endpoints = require('../../api-endpoints')
var ko = require('knockout')

var ContactVolunteerModel = function () {
  var self = this
  self.message = ko.observable()

  self.submit = function () {
    browser.loading()
    ajax.post(
      endpoints.contactVolunteer,
      self.headers(cookies.get('session-token')),
      {
        'Message': self.message()
      }
    )
  }
}

ContactVolunteerModel.prototype = new BaseViewModel()

module.exports = ContactVolunteerModel
