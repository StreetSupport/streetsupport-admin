var ko = require('knockout')
var _ = require('lodash')

function OpeningTime (data) {
  this.day = data.day
  this.startTime = data.startTime
  this.endTime = data.endTime
}

function Address (data) {
  var self = this

  self.key = data.key
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

  self.edit = function () {
    self.isEditing(true)
  }

  self.cancel = function () {
    self.isEditing(false)
  }
}

module.exports = Address
