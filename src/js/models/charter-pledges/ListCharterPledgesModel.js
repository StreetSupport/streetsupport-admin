'use strict'

const ajax = require('../../ajax')
const browser = require('../../browser')
const validation = require('../../validation')
const BaseViewModel = require('../BaseViewModel')
const ListingBaseViewModel = require('../ListingBaseViewModel')
const ko = require('knockout')
require('knockout.validation') // No variable here is deliberate!
const moment = require('moment')
const htmlEncode = require('htmlencode')

import pledgeCats from '../../../data/examplePledges'

function Pledge (data, listener) {
  validation.initialise(ko.validation)
  const self = this
  self.listener = listener
  self.id = data.id
  self.fullName = data.firstName + ' ' + data.lastName
  self.description = ko.observable(htmlEncode.htmlEncode(data.proposedPledge.description))
  self.organisation = data.organisation
  self.email = data.email
  self.supporterCategory = data.supporterCategory
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

    ajax
      .put(endpoint, { isApproved: !self.isApproved() })
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

    ajax
      .put(endpoint, { isFeatured: !self.isFeatured() })
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
    let payload = {
      pledge: htmlEncode.htmlDecode(self.formModel().description())
    }

    ajax
      .put(endpoint, payload)
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
    ajax
      .put(endpoint)
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

  self.pledgeCats = pledgeCats

  self.textToFilterOn = ko.observable()
  self.filterOnIsApproved = ko.observable(false)
  self.filterOnIsFeatured = ko.observable('')
  self.filterOnIsOptedIn = ko.observable('')
  self.filterOnPledgeCat = ko.observable()

  self.filters = [
    { key: 'supporterCategory', setValue: (vm, value) => vm.filterOnPledgeCat(value), getValue: (vm) => vm.filterOnPledgeCat(), isSet: (val) => val !== undefined && val.length > 0 },
    { key: 'searchTerm', setValue: (vm, value) => vm.textToFilterOn(value), getValue: (vm) => vm.textToFilterOn(), isSet: (val) => val !== undefined && val.length > 0 },
    { key: 'isApproved', setValue: (vm, value) => vm.filterOnIsApproved(Boolean(value)), getValue: (vm) => vm.filterOnIsApproved(), isSet: (val) => val !== '' },
    { key: 'isFeatured', setValue: (vm, value) => vm.filterOnIsFeatured(Boolean(value)), getValue: (vm) => vm.filterOnIsFeatured(), isSet: (val) => val !== '' },
    { key: 'isOptedIn', setValue: (vm, value) => vm.filterOnIsOptedIn(Boolean(value)), getValue: (vm) => vm.filterOnIsOptedIn(), isSet: (val) => val !== '' }

  ]
  self.mapItems = (p) => new Pledge(p, self)
  self.mapCsvItems = self.mapItems
  self.baseUrl = self.endpointBuilder.charterPledges().build()

  self.pledgeApprovalUpdated = function (pledge) {
  }

  self.pledgeDeleted = (pledge) => {
    const pledgesWithDeletedRemoved = self.items().filter((p) => p.id !== pledge.id)
    self.items(pledgesWithDeletedRemoved)
  }

  self.init(self)
}

ListCharterPledgesModel.prototype = new ListingBaseViewModel()

module.exports = ListCharterPledgesModel
