'use strict'

var ko = require('knockout')
var ajax = require('../ajax')
var htmlEncode = require('htmlencode')
var Endpoints = require('../endpoint-builder')
var getUrlParameter = require('../get-url-parameter')
var OpeningTime = require('./OpeningTime')
var BaseViewModel = require('./BaseViewModel')
var adminUrls = require('../admin-urls')

function Address (data) {
  if (data === undefined) return

  var self = this
  self.endpoints = new Endpoints()

  self.serviceProviderId = data.serviceProviderId

  self.key = ko.observable(data.key)

  self.savedStreet1 = ko.observable(htmlEncode.htmlDecode(data.streetLine1))
  self.savedStreet2 = ko.observable(htmlEncode.htmlDecode(data.streetLine2))
  self.savedStreet3 = ko.observable(htmlEncode.htmlDecode(data.streetLine3))
  self.savedStreet4 = ko.observable(htmlEncode.htmlDecode(data.streetLine4))
  self.savedCity = ko.observable(htmlEncode.htmlDecode(data.city))
  self.savedPostcode = ko.observable(data.postcode)
  self.savedTelephone = ko.observable(data.telephone)
  self.savedIsOpen247 = ko.observable(data.isOpen247 !== undefined ? data.isOpen247 : false)

  self.street1 = ko.observable(htmlEncode.htmlDecode(data.streetLine1))
  self.street2 = ko.observable(htmlEncode.htmlDecode(data.streetLine2))
  self.street3 = ko.observable(htmlEncode.htmlDecode(data.streetLine3))
  self.street4 = ko.observable(htmlEncode.htmlDecode(data.streetLine4))
  self.city = ko.observable(htmlEncode.htmlDecode(data.city))
  self.postcode = ko.observable(data.postcode)
  self.telephone = ko.observable(data.telephone)
  self.isOpen247 = ko.observable(data.isOpen247 !== undefined ? data.isOpen247 : false)

  var buildOpeningTimes = function (openingTimesData) {
    var openingTimes = openingTimesData !== undefined && openingTimesData !== null
      ? openingTimesData.map((o) => new OpeningTime(o))
      : []
    return openingTimes
  }
  self.savedOpeningTimes = ko.observableArray(buildOpeningTimes(data.openingTimes))
  self.openingTimes = ko.observableArray(buildOpeningTimes(data.openingTimes))

  self.tempKey = ko.observable(data.tempKey)
  self.isEditing = ko.observable(false)
  self.message = ko.observable()
  self.listeners = ko.observableArray()

  self.formatAddress = function (address) {
    var fieldHasValue = function (key) {
      if (address[key] === undefined || address[key] === null) return false
      return address[key].length > 0
    }
    return ['street', 'street1', 'street2', 'street3', 'city', 'postcode']
      .filter((key) => fieldHasValue(key))
      .map((key) => address[key])
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
    self.listeners().forEach((listener) => listener.cancelAddress(self))
  }

  self.deleteAddress = function () {
    var endpoint = self.endpointBuilder.serviceProviders(getUrlParameter.parameter('key')).addresses(self.key()).build()
    ajax.delete(endpoint)
      .then(function (result) {
        self.listeners().forEach((listener) => listener.deleteAddress(self))
      }, function (error) {
        self.handleError(error)
      })
  }

  self.newOpeningTime = function () {
    var openingTimes = self.openingTimes()
    openingTimes.push(new OpeningTime({
      day: '',
      startTime: '',
      endTime: ''
    }))
    self.openingTimes(openingTimes)
  }

  self.removeOpeningTime = function (openingTimeToRemove) {
    var openingTimeHasChanged = function (o) {
      return o.day() !== openingTimeToRemove.day() ||
        o.startTime() !== openingTimeToRemove.startTime() ||
        o.endTime() !== openingTimeToRemove.endTime()
    }
    var remaining = self.openingTimes().filter((o) => openingTimeHasChanged(o))

    self.openingTimes(remaining)
  }

  self.save = function () {
    var mapOpeningTime = function (openingTime) {
      return {
        startTime: openingTime.startTime(),
        endTime: openingTime.endTime(),
        day: openingTime.day()
      }
    }

    var model = {
      Street: self.street1(),
      Street1: self.street2(),
      Street2: self.street3(),
      Street3: self.street4(),
      City: self.city(),
      Postcode: self.postcode(),
      OpeningTimes: self.openingTimes().map((openingTime) => mapOpeningTime(openingTime))
    }

    if (self.tempKey() !== undefined || self.key() === undefined) {
      ajax.post(self.endpointBuilder.serviceProviders(getUrlParameter.parameter('providerId')).addresses().build(),
        model
      ).then(function (result) {
        self.isEditing(false)
        self.key(result.data.key)
        self.setFields()
        self.listeners().forEach((listener) => listener.saveAddress(self))
      }, function (error) {
        self.handleError(error)
      })
    } else {
      ajax.put(self.endpointBuilder.serviceProviders(getUrlParameter.parameter('providerId')).addresses(self.key()).build(),
        model
      ).then(function (result) {
        self.isEditing(false)
        self.setFields()
        self.listeners().forEach((listener) => listener.saveAddress(self))
      }, function (error) {
        self.handleError(error)
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
    self.telephone(self.savedTelephone())

    const buildOpeningTime = function (ot) {
      return new OpeningTime({
        day: ot.day(),
        startTime: ot.startTime(),
        endTime: ot.endTime()
      })
    }

    var restoredOpeningTimes = self.savedOpeningTimes().map((ot) => buildOpeningTime(ot))

    self.openingTimes(restoredOpeningTimes)
  }

  self.setFields = function () {
    self.savedStreet1(self.street1())
    self.savedStreet2(self.street2())
    self.savedStreet3(self.street3())
    self.savedStreet4(self.street4())
    self.savedCity(self.city())
    self.savedPostcode(self.postcode())
    self.savedTelephone(self.telephone())
  }

  self.addListener = function (listener) {
    self.listeners().push(listener)
  }
}

Address.prototype = new BaseViewModel()

module.exports = Address
