var ajax = require('../ajax')
var adminUrls = require('../admin-urls')
var cookies = require('../cookies')
var Address = require('./Address')
var Service = require('./Service')
var getUrlParameter = require('../get-url-parameter')
var ko = require('knockout')
var BaseViewModel = require('./BaseViewModel')

function ServiceProvider (data) {
  var self = this

  self.key = ko.observable(data.key)
  self.name = ko.observable(data.name)
  self.addresses = ko.observableArray(data.addresses.map(address => {
    address.serviceProviderId = self.key
    return new Address(address)
  }))
  self.services = ko.observableArray(data.providedServices.map(service => {
    var newbie = new Service(service)
    newbie.addListener(self)
    return newbie
  }))

  self.deleteService = function (deletedService) {
    var notTheOneToDelete = function (service) {
      return service.id() !== deletedService.id()
    }
    self.services(self.services().filter(s => notTheOneToDelete(s)))
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
        self.serviceProvider(new ServiceProvider(result.data))
      },
      function (error) {
        self.handleError(error)
      })
  }

  self.init()
}

ServiceProviderServices.prototype = new BaseViewModel()

module.exports = ServiceProviderServices
