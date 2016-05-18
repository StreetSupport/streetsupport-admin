'use strict'

var ajax = require('../../ajax')
var adminUrls = require('../../admin-urls')
var browser = require('../../browser')
var cookies = require('../../cookies')
var validation = require('../../validation')
var BaseViewModel = require('../BaseViewModel')
var ko = require('knockout')
require('knockout.validation') // No variable here is deliberate!
var moment = require('moment')
var htmlEncode = require('htmlencode')

function Pledge (data, listener) {
  validation.initialise(ko.validation)
  var self = this
  self.listener = listener
  self.id = data.id
  self.fullName = data.firstName + ' ' + data.lastName
  self.description = ko.observable(htmlEncode.htmlEncode(data.proposedPledge.description))
  self.organisation = data.organisation
  self.email = data.email
  self.mailToLink = 'mailto:' + data.email
  self.creationDate = moment(data.creationDate).format('DD/MM/YY')
  self.isApproved = ko.observable(data.proposedPledge.isApproved)
  self.isFeatured = ko.observable(data.proposedPledge.isFeatured)
  self.isEditable = ko.observable(false)
  self.approvedButtonClass = ko.computed(function () {
    return self.isApproved()
      ? 'btn btn--warning'
      : 'btn btn--primary'
  }, self)
  self.approvedButtonLabel = ko.computed(function () {
    return self.isApproved()
      ? 'Disapprove Pledge'
      : 'Approve Pledge'
  }, self)
  self.featuredButtonClass = ko.computed(function () {
    return self.isFeatured()
      ? 'btn btn--indifferent'
      : 'btn btn--primary'
  }, self)
  self.featuredButtonLabel = ko.computed(function () {
    return self.isFeatured()
      ? 'Unmark as Featured'
      : 'Mark as Featured'
  }, self)

  self.formModel = ko.validatedObservable({
    description: ko.observable(htmlEncode.htmlDecode(data.proposedPledge.description)).extend({ required: true })
  })
  self.fieldErrors = validation.getValidationGroup(ko.validation, self.formModel)

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

  self.toggleFeatured = function () {
    browser.loading()

    var endpoint = self.endpointBuilder.charterPledges(self.id).featured().build()
    var headers = self.headers(cookies.get('session-token'))

    ajax
      .put(endpoint, headers, { isFeatured: !self.isFeatured() })
      .then(function (result) {
        self.isFeatured(!self.isFeatured())
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
    self.formModel().description(htmlEncode.htmlDecode(self.description()))
  }

  let submitForm = () => {
    browser.loading()

    let endpoint = self.endpointBuilder.charterPledges(self.id).pledge().build()
    let headers = self.headers(cookies.get('session-token'))
    let payload = {
      pledge: htmlEncode.htmlDecode(self.formModel().description())
    }

    ajax
      .put(endpoint, headers, payload)
      .then((result) => {
        browser.loaded()
        self.description(self.formModel().description())
        self.isEditable(false)
      }, (error) => {
        self.handleServerError(error)
      })
  }

  self.updatePledge = () => {
    if (self.formModel.isValid()) {
      submitForm()
    } else {
      self.fieldErrors.showAllMessages()
    }
  }

  self.deletePledge = () => {
    browser.loading()
    let endpoint = self.endpointBuilder.charterPledges(self.id).deleted().build()
    let headers = self.headers(cookies.get('session-token'))
    ajax
      .put(endpoint, headers)
      .then((result) => {
        browser.loaded()
        self.listener.pledgeDeleted(self)
      }, (error) => {
        self.handleServerError(error)
      })
  }
}

Pledge.prototype = new BaseViewModel()

function ListCharterPledgesModel () {
  var self = this
  self.allPledges = ko.observableArray()
  self.pledges = ko.observableArray()
  self.showAll = ko.observable(false)
  self.showAllButtonLabel = ko.computed(function () {
    return self.showAll()
      ? 'View awaiting approval'
      : 'Show all'
  }, self)

  self.updateVisiblePledges = function () {
    if (self.showAll() === true) {
      self.pledges(self.allPledges())
    } else {
      self.pledges(self.allPledges().filter(x => x.isApproved() === false))
    }
  }

  self.toggleShowAll = function () {
    self.showAll(!self.showAll())
    self.updateVisiblePledges()
  }

  self.pledgeApprovalUpdated = function (pledge) {
    self.updateVisiblePledges()
  }

  self.pledgeDeleted = (pledge) => {
    let pledgesWithDeletedRemoved = self.allPledges().filter((p) => p.id !== pledge.id)
    self.allPledges(pledgesWithDeletedRemoved)
    self.updateVisiblePledges()
  }

  browser.loading()

  var endpoint = self.endpointBuilder.charterPledges().build()
  var headers = self.headers(cookies.get('session-token'))

  ajax
    .get(endpoint, headers)
    .then(function (result) {
      let pledges = result.data
        .sort((a, b) => a.creationDate < b.creationDate)
        .map(p => new Pledge(p, self))
      self.allPledges(pledges)
      self.pledges(self.allPledges().filter(x => x.isApproved() === false))
      browser.loaded()
    }, function (error) {
      self.handleServerError(error)
    })
}

ListCharterPledgesModel.prototype = new BaseViewModel()

module.exports = ListCharterPledgesModel
