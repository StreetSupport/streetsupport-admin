var ajax = require('../../ajax')
var adminUrls = require('../../admin-urls')
var browser = require('../../browser')
var cookies = require('../../cookies')
var BaseViewModel = require('../BaseViewModel')
var ko = require('knockout')
var forEach = require('lodash/collection/forEach')

var ListVolunteersModel = function () {
  var self = this

  self.volunteers = ko.observableArray()

  browser.loading()

  var endpoint = self.endpointBuilder.volunteers().build()
  var headers = self.headers(cookies.get('session-token'))

  ajax
    .get(endpoint, headers)
    .then(function (success) {
      var volunteers = success.data
      forEach(volunteers, function (v) {
        v.contactUrl = adminUrls.contactVolunteer + '?id=' + v.id
      })
      self.volunteers(volunteers)
      browser.loaded()
    }, function (error) {
      self.handleServerError(error)
    })
}

ListVolunteersModel.prototype = new BaseViewModel()

module.exports = ListVolunteersModel
