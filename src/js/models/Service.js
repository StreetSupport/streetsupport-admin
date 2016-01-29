var ko = require('knockout')
var _ = require('lodash')
var ajax = require('basic-ajax')
var Endpoints = require('../endpoint-builder')
var getUrlParameter = require('../get-url-parameter')
var cookies = require('../cookies')
var OpeningTime = require('./OpeningTime')
var Address = require('./Address')
var BaseViewModel = require('./BaseViewModel')
var adminUrls = require('../admin-urls')

function Service (data) {
  var self = this
  self.serviceProviderId = data.serviceProviderId
  self.id = ko.observable(data.key)

  self.name = data.name
  self.info = ko.observable(data.info)

  var tags = data.tags !== null ? data.tags.join(', ') : ''

  self.tags = ko.observable(tags)
  self.openingTimes = ko.observableArray(_.map(data.openingTimes, function (ot) {
    return new OpeningTime(ot)
  }))
  self.address = new Address(data.address)

  self.savedName = ko.observable(data.name)
  self.savedInfo = ko.observable(data.info)
  self.savedTags = ko.observable(tags)
  self.savedOpeningTimes = ko.observableArray(_.map(data.openingTimes, function (ot) {
    return new OpeningTime(ot)
  }))
  self.savedAddress = new Address(data.address)

  self.isEditing = ko.observable(false)
  self.message = ko.observable()
  self.endpoints = new Endpoints()
  self.listeners = ko.observableArray()

  self.editServiceUrl = adminUrls.serviceProviderServicesEdit + '?providerId=' + data.serviceProviderId + '&serviceId=' + self.id()

  self.edit = function () {
    self.isEditing(true)
  }

  self.cancelEdit = function () {
    self.restoreFields()
  }

  self.restoreFields = function () {
    self.isEditing(false)
    self.info(self.savedInfo())
    self.tags(self.savedTags())

    var restoredOpeningTimes = _.map(self.savedOpeningTimes(), function (ot) {
      return new OpeningTime({
        'day': ot.day(),
        'startTime': ot.startTime(),
        'endTime': ot.endTime()
      })
    })
    self.openingTimes(restoredOpeningTimes)

    self.address.cancel()
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
    var endpoint = self.endpointBuilder.serviceProviders(self.serviceProviderId).services(self.id()).build()
    var tags = []
    if (self.tags().length > 0) tags = _.map(self.tags().split(','), function (t) { return t.trim() })

    var model = JSON.stringify({
      'Info': self.info(),
      'Tags': tags,
      'OpeningTimes': _.map(self.openingTimes(), function (openingTime) {
        return {
          'StartTime': openingTime.startTime(),
          'EndTime': openingTime.endTime(),
          'Day': openingTime.day()
        }
      }),
      'Address': {
        'Street1': self.address.street1(),
        'Street2': self.address.street2(),
        'Street3': self.address.street3(),
        'Street4': self.address.street4(),
        'City': self.address.city(),
        'Postcode': self.address.postcode()
      }
    })

    ajax.put(endpoint,
      self.headers(cookies.get('session-token')),
      model
    ).then(function (result) {
      self.isEditing(false)
      _.forEach(self.listeners(), function (l) {
        l.serviceSaved(self)
      })
    }, function (error) {
      self.handleError(error)
    })
  }

  self.deleteService = function () {
    var endpoint = self.endpointBuilder.serviceProviders(getUrlParameter.parameter('key')).services(self.id()).build()
    ajax.delete(endpoint, self.headers(cookies.get('session-token')), JSON.stringify({}))
    .then(function (result) {
      _.forEach(self.listeners(), function (listener) {
        listener.deleteService(self)
      })
    }, function (error) {
      self.handleError(error)
    })
  }

  self.addListener = function (listener) {
    self.listeners().push(listener)
  }
}

Service.prototype = new BaseViewModel()

module.exports = Service
