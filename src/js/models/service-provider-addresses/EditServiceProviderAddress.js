var ajax = require('basic-ajax')
var ko = require('knockout')
var _ = require('lodash')
var guid = require('node-uuid')
var Endpoints = require('../../endpoint-builder')
var cookies = require('../../cookies')
var Address = require('../Address')
var getUrlParameter = require('../../get-url-parameter')

function EditServiceProviderAddress () {
  var self = this
  self.serviceProvider = ko.observable()
  self.endpoints = new Endpoints()
  self.address = ko.observable()

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
        self.address(new Address(result.json))
      },
      function (error) {
      })
  }

  self.init()
}

module.exports = EditServiceProviderAddress
