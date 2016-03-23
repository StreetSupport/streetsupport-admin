var ajax = require('../../ajax')
var browser = require('../../browser')
var cookies = require('../../cookies')
var BaseViewModel = require('../BaseViewModel')
var ko = require('knockout')

var ListVolunteersModel = function () {
  var self = this

  var endpoint = self.endpointBuilder.volunteers().build()
  var headers = self.headers(cookies.get('session-token'))

  self.volunteers = ko.observableArray()

  browser.loading()

  ajax
    .get(endpoint, headers)
    .then(function (success) {
      self.volunteers(success.data)
      browser.loaded()
    }, function (error) {
      self.handleServerError(error)
    })
}

ListVolunteersModel.prototype = new BaseViewModel()

module.exports = ListVolunteersModel
