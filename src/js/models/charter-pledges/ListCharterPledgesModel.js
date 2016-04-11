var ajax = require('../../ajax')
var adminUrls = require('../../admin-urls')
var browser = require('../../browser')
var cookies = require('../../cookies')
var BaseViewModel = require('../BaseViewModel')
var ko = require('knockout')

function Pledge(data) {
  var self = this
  self.fullName = data.firstName + ' ' + data.lastName
  self.description = data.proposedPledge.description
  self.organisation = data.organisation
}

function ListCharterPledgesModel() {
  var self = this
  self.pledges = ko.observableArray()

  browser.loading()

  var endpoint = self.endpointBuilder.charterPledges().build()
  var headers = self.headers(cookies.get('session-token'))

  ajax
    .get(endpoint, headers)
    .then(function (result) {
      var pledges = result.data.map(p => new Pledge(p))
      console.log('pledges')
      console.log(pledges)
      self.pledges(pledges)
      browser.loaded()
    }, function (error) {

    })
}

ListCharterPledgesModel.prototype = new BaseViewModel()

module.exports = ListCharterPledgesModel
