var ajax = require('../../ajax')
var adminUrls = require('../../admin-urls')
var browser = require('../../browser')
var cookies = require('../../cookies')
var BaseViewModel = require('../BaseViewModel')
var ko = require('knockout')

function Pledge(data, listener) {
  var self = this
  self.listener = listener
  self.id = data.id
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
        listener.pledgeApprovalUpdated(self.isApproved())
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
  self.showAllButtonLabel = ko.computed(function () {
    return self.showAll()
      ? 'View awaiting approval'
      : 'Show all'
  }, self)

  self.updateVisiblePledges = function () {
    if(self.showAll() === true) {
      self.pledges(self.allPledges)
    } else {
      self.pledges(self.allPledges.filter(x => x.isApproved() === false))
    }

    console.log(self.allPledges[0].isApproved())
    console.log(self.allPledges[1].isApproved())
  }

  self.toggleShowAll = function () {
    self.showAll(!self.showAll())
    self.updateVisiblePledges()
  }

  self.pledgeApprovalUpdated = function (pledge) {
    self.updateVisiblePledges()
  }

  browser.loading()

  var endpoint = self.endpointBuilder.charterPledges().build()
  var headers = self.headers(cookies.get('session-token'))

  ajax
    .get(endpoint, headers)
    .then(function (result) {
      self.allPledges = result.data.map(p => new Pledge(p, self))
      self.pledges(self.allPledges.filter(x => x.isApproved() === false))
      browser.loaded()
    }, function (error) {
      self.handleServerError(error)
    })
}

ListCharterPledgesModel.prototype = new BaseViewModel()

module.exports = ListCharterPledgesModel
