var ko = require('knockout')
var _ = require('lodash')
var ajax = require('basic-ajax')
var Endpoints = require('../endpoint-builder')
var getUrlParameter = require('../get-url-parameter')
var cookies = require('../cookies')
var OpeningTime = require('./OpeningTime')

function Service(data) {
  var self = this

  self.id = ko.observable(data.key)
  self.name = data.name
  self.info = ko.observable(data.info)
  self.tags = ko.observable(data.tags)
  self.openingTimes = ko.observableArray(data.openingTimes.map(ot => new OpeningTime(ot)))

  self.savedName = ko.observable(data.name)
  self.savedInfo = ko.observable(data.info)
  self.savedTags = ko.observable(data.tags)
  self.savedOpeningTimes = ko.observableArray(data.openingTimes.map(ot => new OpeningTime(ot)))

  self.isEditing = ko.observable(false)
  self.message = ko.observable()
  self.endpoints = new Endpoints()

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

    var restoredOpeningTimes = _.map(self.savedOpeningTimes(), function(ot) {
      return new OpeningTime({
        'day': ot.day(),
        'startTime': ot.startTime(),
        'endTime': ot.endTime(),
      })
    })

    self.openingTimes(restoredOpeningTimes)
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
    var remaining = _.filter(self.openingTimes(), function(o) {
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
    var model = JSON.stringify({
      'Info': self.info(),
      'Tags': self.tags(),
      'OpeningTimes': self.openingTimes().map(openingTime => {
        return {
          'StartTime': openingTime.startTime(),
          'EndTime': openingTime.endTime(),
          'Day': openingTime.day()
        }
      })
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
}

module.exports = Service
