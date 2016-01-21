var ajax = require('basic-ajax')
var Endpoints = require('../endpoint-builder')
var adminUrls = require('../admin-urls')
var cookies = require('../cookies')
var Address = require('./Address')
var Service = require('./Service')
var getUrlParameter = require('../get-url-parameter')
var ko = require('knockout')
var _ = require('lodash')

function ServiceProvider (data) {
  var self = this

  self.key = ko.observable(data.key)
  self.name = ko.observable(data.name)
  self.addresses = ko.observableArray(_.map(data.addresses, function (address) {
    return new Address(address)
  }))
  self.services = ko.observableArray(_.map(data.providedServices, function (service) {
    var newbie = new Service(service)
    newbie.addListener(self)
    return newbie
  }))

  self.deleteService = function (deletedService) {
    var remainingServices = _.filter(self.services(), function (service) {
      return service.id() !== deletedService.id()
    })
    self.services(remainingServices)
  }
}

function ServiceProviderServices () {
  var self = this
  self.serviceProvider = ko.observable()
  self.endpoints = new Endpoints()
  self.addServiceLink = adminUrls.addServiceProviderService + '?key=' + getUrlParameter.parameter('key')

  self.init = function () {
    var endpoint = self.endpoints.serviceProviders(getUrlParameter.parameter('key')).build()
    ajax.get(endpoint,
      {
        'content-type': 'application/json',
        'session-token': cookies.get('session-token')
      },
      {})
      .then(function (result) {
        self.serviceProvider(new ServiceProvider(result.json))
      },
      function (error) {
      })
  }

  self.init()
}

module.exports = ServiceProviderServices
