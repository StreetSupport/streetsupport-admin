'use strict'

var ajax = require('../../ajax')
var browser = require('../../browser')
var cookies = require('../../cookies')
var BaseViewModel = require('../BaseViewModel')
var ko = require('knockout')
var moment = require('moment')

function Pledge (data, listener) {
  var self = this
  self.listener = listener
  self.id = data.id
  self.fullName = data.firstName + ' ' + data.lastName
  self.description = ko.observable(data.proposedPledge.description)
  self.newDescription = ko.observable(data.proposedPledge.description)
  self.organisation = data.organisation
  self.email = data.email
  self.mailToLink = 'mailto:' + data.email
  self.creationDate = moment(data.documentCreationDate).format('DD/MM/YY')
  self.isApproved = ko.observable(data.proposedPledge.isApproved)
  self.isEditable = ko.observable(false)
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

    var endpoint = self.endpointBuilder.charterPledges(self.id).approval().build()
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

  self.editPledge = () => {
    self.isEditable(true)
  }

  self.cancelEdit = () => {
    self.isEditable(false)
    self.newDescription(self.description())
  }

  self.updatePledge = () => {
    browser.loading()

    let endpoint = self.endpointBuilder.charterPledges(self.id).pledge().build()
    let headers = self.headers(cookies.get('session-token'))
    let payload = {
      pledge: self.newDescription()
    }

    ajax
      .put(endpoint, headers, payload)
      .then((result) => {
        browser.loaded()
        self.description(self.newDescription())
        self.isEditable(false)
      }, (error) => {

      })
  }
}

Pledge.prototype = new BaseViewModel()

function ListCharterPledgesModel () {
  var self = this
  self.pledges = ko.observableArray()
  self.showAll = ko.observable(false)
  self.showAllButtonLabel = ko.computed(function () {
    return self.showAll()
      ? 'View awaiting approval'
      : 'Show all'
  }, self)

  self.updateVisiblePledges = function () {
    if (self.showAll() === true) {
      self.pledges(self.allPledges)
    } else {
      self.pledges(self.allPledges.filter(x => x.isApproved() === false))
    }
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
