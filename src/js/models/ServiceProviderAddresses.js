var ajax = require('basic-ajax')
var cookies = require('../cookies')
var Address = require('./Address')
var getUrlParameter = require('../get-url-parameter')
var ko = require('knockout')
var guid = require('node-uuid')
var BaseViewModel = require('./BaseViewModel')

function ServiceProvider (data) {
  var self = this

  self.key = ko.observable(data.key)
  self.name = ko.observable(data.name)
  self.addresses = ko.observableArray(data.addresses.map(address => {
    var newbie = new Address(address)
    newbie.addListener(self)
    return newbie
  }))

  self.addAddress = function () {
    var tempKey = guid.v4()

    var addresses = self.addresses()
    var newAddress = new Address({
      'openingTimes': [],
      'tempKey': tempKey
    })
    newAddress.addListener(self)
    newAddress.edit()
    addresses.push(newAddress)
    self.addresses(addresses)
  }

  self.cancelAddress = function (cancelledAddress) {
    var notTheCancelledAddress = function (address) {
      var isNew = address.tempKey() === undefined

      if (isNew) return true

      var isNotTheAddressWeAreLookingFor = address.tempKey() !== cancelledAddress.tempKey()

      return isNotTheAddressWeAreLookingFor
    }
    var remainingAddresses = self.addresses().filter(address => notTheCancelledAddress(address))
    self.addresses(remainingAddresses)
  }

  self.deleteAddress = function (deleteAddress) {
    var notTheDeletedAddress = function (address)  {
      return address.key() !== deleteAddress.key()
    }
    var remainingAddresses = self.addresses().filter(address => notTheDeletedAddress(address))
    self.addresses(remainingAddresses)
  }
}

function ServiceProviderAddresses () {
  var self = this
  self.serviceProvider = ko.observable()

  self.init = function () {
    ajax.get(self.endpointBuilder.serviceProviders(getUrlParameter.parameter('key')).addresses().build(),
      self.headers(cookies.get('session-token')),
      {})
      .then(function (result) {
        self.serviceProvider(new ServiceProvider(result.json))
      },
      function (error) {
        self.handleError(error)
      })
  }

  self.init()
}

ServiceProviderAddresses.prototype = new BaseViewModel()

module.exports = ServiceProviderAddresses
