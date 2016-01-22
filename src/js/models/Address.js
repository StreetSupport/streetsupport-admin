var ko = require('knockout')
var _ = require('lodash')
var ajax = require('basic-ajax')
var Endpoints = require('../endpoint-builder')
var getUrlParameter = require('../get-url-parameter')
var cookies = require('../cookies')
var OpeningTime = require('./OpeningTime')
var adminUrls = require('../admin-urls')

function Address (data) {
  var self = this
  self.endpoints = new Endpoints()

  self.serviceProviderId = data.serviceProviderId


  self.key = ko.observable(data.key)
  self.savedStreet1 = ko.observable(data.street)
  self.savedStreet2 = ko.observable(data.street1)
  self.savedStreet3 = ko.observable(data.street2)
  self.savedStreet4 = ko.observable(data.street3)
  self.savedCity = ko.observable(data.city)
  self.savedPostcode = ko.observable(data.postcode)

  self.street1 = ko.observable(data.street)
  self.street2 = ko.observable(data.street1)
  self.street3 = ko.observable(data.street2)
  self.street4 = ko.observable(data.street3)
  self.city = ko.observable(data.city)
  self.postcode = ko.observable(data.postcode)

  self.savedOpeningTimes = ko.observableArray(_.map(data.openingTimes, function (time) {
    return new OpeningTime(time)
  }))

  self.openingTimes = ko.observableArray(_.map(data.openingTimes, function (time) {
    return new OpeningTime(time)
  }))

  self.tempKey = ko.observable(data.tempKey)
  self.isEditing = ko.observable(false)
  self.message = ko.observable()
  self.listeners = ko.observableArray()

  self.formatAddress = function (address) {
    return _.chain(['street', 'street1', 'street2', 'street3', 'city', 'postcode'])
      .filter(function (key) {
        if (address[key] === undefined || address[key] === null) return false
        return address[key].length > 0
      })
      .map(function (key) {
        return address[key]
      })
      .value()
      .join(', ')
  }
  self.formatted = self.formatAddress(data)

  self.addAddressUrl = adminUrls.serviceProviderAddressesAdd + '?providerId=' + self.serviceProviderId
  self.editAddressUrl = adminUrls.serviceProviderAddressesEdit + '?providerId=' + self.serviceProviderId + '&addressId=' + self.key()
  self.deleteAddressUrl = adminUrls.serviceProviderAddressesDelete + '?providerId=' + self.serviceProviderId + '&addressId=' + self.key()

  self.edit = function () {
    self.isEditing(true)
  }

  self.cancel = function () {
    self.restoreFields()
    _.forEach(self.listeners(), function (listener) {
      listener.cancelAddress(self)
    })
  }

  self.deleteAddress = function () {
    var endpoint = self.endpoints.serviceProviders(getUrlParameter.parameter('key')).addresses(self.key()).build()
    var headers = {
      'content-type': 'application/json',
      'session-token': cookies.get('session-token')
    }
    ajax.delete(endpoint, headers, JSON.stringify({}))
    .then(function (result) {
      _.forEach(self.listeners(), function (listener) {
        listener.deleteAddress(self)
      })
    }, function (error) {

    })
  }

  self.newOpeningTime = function () {
    var openingTimes = self.openingTimes()
    openingTimes.push(new OpeningTime({
      'day': '',
      'startTime': '',
      'endTime': ''
    }))
    self.openingTimes(openingTimes)
  }

  self.removeOpeningTime = function (openingTimeToRemove) {
    var remaining = _.filter(self.openingTimes(), function (o) {
      return o.day() !== openingTimeToRemove.day()
          || o.startTime() !== openingTimeToRemove.startTime()
          || o.endTime() !== openingTimeToRemove.endTime()
    })

    self.openingTimes(remaining)
  }

  self.save = function () {
    var headers = {
      'content-type': 'application/json',
      'session-token': cookies.get('session-token')
    }
    var model = JSON.stringify({
      'Street': self.street1(),
      'Street1': self.street2(),
      'Street2': self.street3(),
      'Street3': self.street4(),
      'City': self.city(),
      'Postcode': self.postcode(),
      'OpeningTimes': _.map(self.openingTimes(), function (openingTime) {
        return {
          'startTime': openingTime.startTime(),
          'endTime': openingTime.endTime(),
          'day': openingTime.day()
        }
      })
    })

    if (self.tempKey() !== undefined || self.key() === undefined) {
      ajax.post(self.endpoints.serviceProviders(getUrlParameter.parameter('providerId')).addresses().build(),
        headers,
        model
      ).then(function (result) {
        self.isEditing(false)
        self.key(result.json.key)
        self.setFields()
        _.forEach(self.listeners(), function (listener) {
          listener.saveAddress(self)
        })
      }, function (error) {
        var response = JSON.parse(error.response)
        self.message(response.messages.join('<br />'))
      })
    } else {
      ajax.put(self.endpoints.serviceProviders(getUrlParameter.parameter('providerId')).addresses(self.key()).build(),
        headers,
        model
      ).then(function (result) {
        self.isEditing(false)
        self.setFields()
        _.forEach(self.listeners(), function (listener) {
          listener.saveAddress(self)
        })
      }, function (error) {
        var response = JSON.parse(error.response)
        self.message(response.messages.join('<br />'))
      })
    }
  }

  self.restoreFields = function () {
    self.isEditing(false)
    self.street1(self.savedStreet1())
    self.street2(self.savedStreet2())
    self.street3(self.savedStreet3())
    self.street4(self.savedStreet4())
    self.city(self.savedCity())
    self.postcode(self.savedPostcode())

    var restoredOpeningTimes = _.map(self.savedOpeningTimes(), function (ot) {
      return new OpeningTime({
        'day': ot.day(),
        'startTime': ot.startTime(),
        'endTime': ot.endTime()
      })
    })

    self.openingTimes(restoredOpeningTimes)
  }

  self.setFields = function () {
    self.savedStreet1(self.street1())
    self.savedStreet2(self.street2())
    self.savedStreet3(self.street3())
    self.savedStreet4(self.street4())
    self.savedCity(self.city())
    self.savedPostcode(self.postcode())
  }

  self.addListener = function (listener) {
    self.listeners().push(listener)
  }
}

module.exports = Address
