var ajax = require('../../ajax')
var adminUrls = require('../../admin-urls')
var browser = require('../../browser')
var cookies = require('../../cookies')
var BaseViewModel = require('../BaseViewModel')
var ko = require('knockout')

function Pledge(data) {
  var self = this
  self.id= data.id
  self.fullName = data.firstName + ' ' + data.lastName
  self.description = data.proposedPledge.description
  self.organisation = data.organisation
  self.isApproved = ko.observable(data.proposedPledge.isApproved)
  self.buttonClass = ko.computed(function () {
    return self.isApproved()
      ? 'btn btn--warning'
      : 'btn btn--primary'
  }, self)
  self.buttonLabel = ko.computed(function () {
    return self.isApproved()
      ? 'Disapprove Pledge'
      : 'Approve Pledge'
  }, self)

  self.toggleApproval = function () {
    browser.loading()

    var endpoint = self.endpointBuilder.charterPledges(self.id).build()
    var headers = self.headers(cookies.get('session-token'))

    ajax
      .put(endpoint, headers, { isApproved: !self.isApproved() })
      .then(function (result) {
        self.isApproved(!self.isApproved())
        browser.loaded()
      }, function (error) {
        self.handleServerError(error)
      })
  }
}

Pledge.prototype = new BaseViewModel()

function ListCharterPledgesModel() {
  var self = this
  self.pledges = ko.observableArray()
  self.showAll = ko.observable(false)

  browser.loading()

  var endpoint = self.endpointBuilder.charterPledges().build()
  var headers = self.headers(cookies.get('session-token'))

  ajax
    .get(endpoint, headers)
    .then(function (result) {
      self.allPledges = result.data.map(p => new Pledge(p))
      self.pledges(self.allPledges)
      browser.loaded()
    }, function (error) {
      self.handleServerError(error)
    })
}

ListCharterPledgesModel.prototype = new BaseViewModel()

module.exports = ListCharterPledgesModel
