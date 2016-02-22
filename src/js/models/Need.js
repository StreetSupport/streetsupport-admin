var ko = require('knockout')
var _ = require('lodash')
var ajax = require('basic-ajax')
var Endpoints = require('../endpoint-builder')
var getUrlParameter = require('../get-url-parameter')
var cookies = require('../cookies')
var OpeningTime = require('./OpeningTime')
var BaseViewModel = require('./BaseViewModel')
var adminUrls = require('../admin-urls')

function Need (data) {
  var self = this
  self.endpoints = new Endpoints()

  self.serviceProviderId = getUrlParameter.parameter('providerId')

  self.id = ko.observable(data.id)
  self.savedDescription = ko.observable(data.description)

  self.description = ko.observable(data.description)

  self.tempKey = ko.observable(data.tempKey)
  self.isEditing = ko.observable(false)
  self.listeners = ko.observableArray()

  // self.editAddressUrl = adminUrls.serviceProviderAddressesEdit + '?providerId=' + self.serviceProviderId + '&addressId=' + self.key()
  // self.deleteAddressUrl = adminUrls.serviceProviderAddressesDelete + '?providerId=' + self.serviceProviderId + '&addressId=' + self.key()

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
    var endpoint = self.endpointBuilder.serviceProviders(getUrlParameter.parameter('key')).addresses(self.key()).build()
    ajax.delete(endpoint, self.headers(cookies.get('session-token')), JSON.stringify({}))
    .then(function (result) {
      _.forEach(self.listeners(), function (listener) {
        listener.deleteAddress(self)
      })
    }, function (error) {
      self.handleError(error)
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
      return o.day() !== openingTimeToRemove.day() ||
             o.startTime() !== openingTimeToRemove.startTime() ||
             o.endTime() !== openingTimeToRemove.endTime()
    })

    self.openingTimes(remaining)
  }

  self.save = function () {
    var model = JSON.stringify({
      'Description': self.description(),
    })

    // if (self.tempKey() !== undefined || self.key() === undefined) {
      ajax.post(self.endpointBuilder.serviceProviders(getUrlParameter.parameter('providerId')).needs().build(),
        self.headers(cookies.get('session-token')),
        model
      ).then(function (result) {
        self.isEditing(false)
        //self.key(result.json.key)
        //self.setFields()
        _.forEach(self.listeners(), function (listener) {
          listener.saveNeed(self)
        })
      }, function (error) {
        self.handleError(error)
      })
    // } else {
    //   ajax.put(self.endpointBuilder.serviceProviders(getUrlParameter.parameter('providerId')).addresses(self.key()).build(),
    //     self.headers(cookies.get('session-token')),
    //     model
    //   ).then(function (result) {
    //     self.isEditing(false)
    //     self.setFields()
    //     _.forEach(self.listeners(), function (listener) {
    //       listener.saveAddress(self)
    //     })
    //   }, function (error) {
    //     self.handleError(error)
    //   })
    // }
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

Need.prototype = new BaseViewModel()

module.exports = Need
