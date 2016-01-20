var ko = require('knockout')

function OpeningTime (data) {
  var self = this

  self.days = ko.observableArray(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'])
  self.day = ko.observable(data.day)
  self.startTime = ko.observable(data.startTime)
  self.endTime = ko.observable(data.endTime)
}

module.exports = OpeningTime
