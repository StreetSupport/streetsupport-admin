var ko = require('knockout')
var _ = require('lodash')
var ajax = require('basic-ajax')
var endpoints = require('../api-endpoints')
var getUrlParameter = require('../get-url-parameter')
var cookies = require('../cookies')

function OpeningTime (data) {
  this.day = data.day
  this.startTime = data.startTime
  this.endTime = data.endTime
}

function Address (data) {
  var self = this

  self.key = data.key
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

  self.openingTimes = ko.observableArray(_.map(data.openingTimes, function (time) {
    return new OpeningTime(time)
  }))

  self.isEditing = ko.observable(false)
  self.message = ko.observable()

  self.edit = function () {
    self.isEditing(true)
  }

  self.cancel = function () {
    self.isEditing(false)

    self.street1(self.savedStreet1())
    self.street2(self.savedStreet2())
    self.street3(self.savedStreet3())
    self.street4(self.savedStreet4())
    self.city(self.savedCity())
    self.postcode(self.savedPostcode())
  }

  self.save = function () {
    ajax.put(endpoints.serviceProviderAddresses + '/' + getUrlParameter.parameter('key') + '/update/' + self.key,
      {
        'content-type': 'application/json',
        'session-token': cookies.get('session-token')
      },
      JSON.stringify({
        'Street': self.street1(),
        'Street1': self.street2(),
        'Street2': self.street3(),
        'Street3': self.street4(),
        'City': self.city(),
        'Postcode': self.postcode()
      })
      ).then(function (result) {
        self.isEditing(false)

        self.savedStreet1(self.street1())
        self.savedStreet2(self.street2())
        self.savedStreet3(self.street3())
        self.savedStreet4(self.street4())
        self.savedCity(self.city())
        self.savedPostcode(self.postcode())
      }, function (error) {
        var response = JSON.parse(error.response)
        self.message(response.messages.join('<br />'))
      })
  }
}

module.exports = Address
