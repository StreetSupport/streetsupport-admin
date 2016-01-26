var ko = require('knockout')
var ajax = require('basic-ajax')
var Endpoints = require('../endpoint-builder')
var adminUrls = require('../admin-urls')
var cookies = require('../cookies')
var browser = require('../browser')

function CreateServiceProvider () {
  var self = this

  self.endpoints = new Endpoints()

  self.name = ko.observable('')

  self.save = function () {
    var endpoint = self.endpoints.serviceProviders().build()
    var headers = {
      'content-type': 'application/json',
      'session-token': cookies.get('session-token')
    }
    var payload = {
      'Name': self.name()
    }
    ajax.post(endpoint, headers, JSON.stringify(payload))
  }
}

module.exports = CreateServiceProvider
