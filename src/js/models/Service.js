var ko = require('knockout')
var _ = require('lodash')
var ajax = require('basic-ajax')
var Endpoints = require('../endpoint-builder')
var getUrlParameter = require('../get-url-parameter')
var cookies = require('../cookies')
var OpeningTime = require('./OpeningTime')
var Address = require('./Address')

function Service (data) {
  var self = this
  self.id = ko.observable(data.key)
  self.name = data.name
  self.info = ko.observable(data.info)
  self.tags = ko.observable(data.tags)
  self.openingTimes = ko.observableArray(data.openingTimes.map(ot => new OpeningTime(ot)))
  self.address = new Address(data.address)

  self.savedName = ko.observable(data.name)
  self.savedInfo = ko.observable(data.info)
  self.savedTags = ko.observable(data.tags)
  self.savedOpeningTimes = ko.observableArray(data.openingTimes.map(ot => new OpeningTime(ot)))
  self.savedAddress = new Address(data.address)

  self.isEditing = ko.observable(false)
  self.message = ko.observable()
  self.endpoints = new Endpoints()
  self.listeners = ko.observableArray()

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
    var endpoint = self.endpoints.serviceProviders(getUrlParameter.parameter('key')).services(self.id()).build()
    var headers = {
      'content-type': 'application/json',
      'session-token': cookies.get('session-token')
    }
    var tags = []
    if (self.tags().length > 0) tags = self.tags().split(',').map(t => t.trim())

    var model = JSON.stringify({
      'Info': self.info(),
      'Tags': tags,
      'OpeningTimes': self.openingTimes().map(openingTime => {
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
      headers,
      model
    ).then(function (result) {
      self.isEditing(false)
    }, function (error) {
      var response = JSON.parse(error.response)
      self.message(response.messages.join('<br />'))
    })
  }

  self.deleteService = function () {
    var endpoint = self.endpoints.serviceProviders(getUrlParameter.parameter('key')).services(self.id()).build()
    var headers = {
      'content-type': 'application/json',
      'session-token': cookies.get('session-token')
    }
    ajax.delete(endpoint, headers, JSON.stringify({}))
    .then(function (result) {
      _.forEach(self.listeners(), function (listener) {
        listener.deleteService(self)
      })
    }, function (error) {

    })
  }

  self.addListener = function (listener) {
    self.listeners().push(listener)
  }
}

module.exports = Service
