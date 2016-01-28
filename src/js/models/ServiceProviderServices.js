var ajax = require('basic-ajax')
var adminUrls = require('../admin-urls')
var cookies = require('../cookies')
var Address = require('./Address')
var Service = require('./Service')
var getUrlParameter = require('../get-url-parameter')
var ko = require('knockout')
var _ = require('lodash')
var BaseViewModel = require('./BaseViewModel')

function ServiceProvider (data) {
  var self = this

  self.key = ko.observable(data.key)
  self.name = ko.observable(data.name)
  self.addresses = ko.observableArray(_.map(data.addresses, function (address) {
    address.serviceProviderId = self.key
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
  self.addServiceLink = adminUrls.addServiceProviderService + '?key=' + getUrlParameter.parameter('providerId')

  self.init = function () {
    var endpoint = self.endpointBuilder.serviceProviders(getUrlParameter.parameter('providerId')).build()
    ajax.get(endpoint,
      self.headers(cookies.get('session-token')),
      {})
      .then(function (result) {
        self.serviceProvider(new ServiceProvider(result.json))
      },
      function (error) {
      })
  }

  self.init()
}

ServiceProviderServices.prototype = new BaseViewModel()

module.exports = ServiceProviderServices
