var ajax = require('basic-ajax')
var ko = require('knockout')
var Endpoints = require('../../endpoint-builder')
var cookies = require('../../cookies')
var Address = require('../Address')
var getUrlParameter = require('../../get-url-parameter')
var browser =   require('../../browser')
var adminUrls = require('../../admin-urls')

function EditServiceProviderAddress () {
  var self = this
  self.endpoints = new Endpoints()
  self.address = ko.observable()

  self.saveAddress = function (address) {
    browser.redirect(adminUrls.serviceProviders + '?key=' + getUrlParameter.parameter('providerId'))
  }

  self.init = function () {
    var endpoint = self.endpoints
      .serviceProviders(getUrlParameter.parameter('providerId'))
      .addresses(getUrlParameter.parameter('addressId'))
      .build()

    ajax.get(endpoint,
      {
        'content-type': 'application/json',
        'session-token': cookies.get('session-token')
      },
      {})
      .then(function (result) {
        var address = new Address(result.json)
        address.addListener(self)
        self.address(address)
      },
      function (error) {
      })
  }

  self.init()
}

module.exports = EditServiceProviderAddress
