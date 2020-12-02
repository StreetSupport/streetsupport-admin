'use strict'

const ko = require('knockout')
const moment = require('moment')

const adminUrls = require('../admin-urls')
const ajax = require('../ajax')
const BaseViewModel = require('./BaseViewModel')
const browser = require('../browser')
const Endpoints = require('../endpoint-builder')
const htmlEncode = require('htmlencode')
const dateFormat = 'YYYY-MM-DD'

import { clientGroups } from '../../data/generated/client-groups'

function Need (data) {
  const self = this
  self.endpoints = new Endpoints()

  self.serviceProviderId = data.serviceProviderId
  self.availableTypes = ko.observableArray(['money', 'time', 'items'])
  self.availableClientGroups = ko.observableArray(clientGroups)

  if (data.clientGroups !== null && data.clientGroups !== undefined && data.clientGroups.length > 0) {
    self.сlientGroupKeys = ko.observableArray(data.clientGroups.map((v) => v.key))
  } else {
    self.сlientGroupKeys = ko.observableArray([])
  }

  self.id = ko.observable(data.id)
  self.description = ko.observable(htmlEncode.htmlDecode(data.description))
  self.type = ko.observable(data.type)
  self.isPeopleOrThings = ko.computed(function () {
    const type = self.type()
    return type !== undefined && (type.toLowerCase() === 'time' || type.toLowerCase() === 'items')
  }, self)
  self.isMoney = ko.computed(function () {
    const type = self.type()
    return type !== undefined && (type.toLowerCase() === 'money')
  }, self)
  self.reason = ko.observable(htmlEncode.htmlDecode(data.reason))
  self.moreInfoUrl = ko.observable(data.moreInfoUrl)
  self.startDate = ko.observable(data.neededDate ? moment(data.neededDate).format(dateFormat) : moment().format(dateFormat))
  self.endDate = ko.observable(data.endDate ? moment(data.endDate).format(dateFormat) : moment().add('1', 'days').format(dateFormat))
  self.postcode = ko.observable(data.postcode)
  self.instructions = ko.observable(htmlEncode.htmlDecode(data.instructions))
  self.email = ko.observable(data.email)
  self.donationAmountInPounds = ko.observable(data.donationAmountInPounds)
  self.donationUrl = ko.observable(data.donationUrl)
  self.keywords = ko.observable(data.keywords !== undefined && data.keywords !== null ? data.keywords.join(', ') : '')
  self.customMessage = ko.observable(data.customMessage)
  self.isPriority = ko.observable(data.isPriority)

  self.neededDateReadOnly = ko.observable(moment(data.neededDate))
  self.neededDate = ko.computed(function () {
    return moment().isSame(self.neededDateReadOnly(), 'day') ? 'Posted today' : (moment().subtract(1, 'day').isSame(self.neededDateReadOnly(), 'day') ? 'Posted yesterday' : (moment().isBefore(self.neededDateReadOnly(), 'day') ? 'Will be posted ' + self.neededDateReadOnly().fromNow() : 'Posted ' + self.neededDateReadOnly().fromNow()))
  }, self)
  self.canRepost = ko.computed(function () {
    const now = moment()
    const diff = now.diff(self.neededDateReadOnly(), 'days')
    return diff >= 7
  }, self)

  self.tempKey = ko.observable(data.tempKey)
  self.isEditing = ko.observable(false)
  self.listeners = ko.observableArray()

  self.editNeedUrl = adminUrls.serviceProviderNeedsEdit + '?providerId=' + self.serviceProviderId + '&needId=' + self.id()

  self.viewOffersUrl = `${adminUrls.needResponses}?needId=${self.id()}`

  self.totalResponses = ko.observable(0)

  self.startDate.subscribe((value) => {
    if (moment(value) > moment(self.endDate()).add('-1', 'days')) {
      self.endDate(moment(value).add('1', 'days').format(dateFormat))
    }
  })

  self.repostNeed = function () {
    browser.loading()
    const endpoint = self.endpointBuilder
      .serviceProviders(self.serviceProviderId)
      .needs(self.id())
      .build() + '/neededDate'
    const now = moment()
    const model = {
      NeededDate: now.toISOString()
    }
    ajax.put(endpoint,
      model
    ).then(function (result) {
      if (result.statusCode === 200) {
        self.neededDateReadOnly(now)
        browser.loaded()
      } else {
        self.handleError(result)
      }
    }, function (error) {
      self.handleError(error)
    })
  }

  self.deleteNeed = function () {
    var endpoint = `${self.endpointBuilder.serviceProviders(self.serviceProviderId).needs(self.id()).build()}`
    ajax.delete(endpoint)
    .then(function (result) {
      self.listeners().forEach((l) => l.deleteNeed(self))
    }, function (error) {
      self.handleError(error)
    })
  }

  self.resolveNeed = function () {
    var endpoint = `${self.endpointBuilder.serviceProviders(self.serviceProviderId).needs(self.id()).build()}/is-resolved`
    ajax.patch(endpoint, { IsResolved: true })
    .then(function (result) {
      self.listeners().forEach((l) => l.deleteNeed(self))
    }, function (error) {
      self.handleError(error)
    })
  }

  self.markAsPriority = function () {
    var endpoint = `${self.endpointBuilder.serviceProviders(self.serviceProviderId).needs(self.id()).build()}/is-priority`
    ajax.patch(endpoint, { IsPriority: !self.isPriority() })
    .then(function (result) {
      self.isPriority(!self.isPriority())
    }, function (error) {
      self.handleError(error)
    })
  }

  self.save = function () {
    self.isProcessing(true)
    let keywords = self.keywords() !== undefined
      ? self.keywords().split(',').map((k) => k.trim())
      : []
    var model = {
      'Description': self.description(),
      'Type': self.type(),
      'Reason': self.reason(),
      'MoreInfoUrl': self.moreInfoUrl(),
      'Postcode': self.postcode(),
      'Instructions': self.instructions(),
      'Email': self.email(),
      'DonationAmountInPounds': self.donationAmountInPounds(),
      'DonationUrl': self.donationUrl(),
      'CustomMessage': self.customMessage(),
      'Keywords': keywords,
      'ClientGroupKeys': self.сlientGroupKeys(),
      // We must use new Date(self.startDate()) or moment(self.startDate()).utcOffset(0, true) for passing date without timezone. In the database this date should be saved in utc format (00 hours 00 minutes).
      'NeededDate': new Date(self.startDate()),
       // We must use new Date(self.endDate()) or moment(self.endDate()).utcOffset(0, true) for passing date without timezone. In the database this date should be saved in utc format (00 hours 00 minutes).
      'EndDate': new Date(self.endDate())
    }

    if (self.id() === undefined) { // adding
      browser.loading()
      ajax.post(self.endpointBuilder.serviceProviders(self.serviceProviderId).needs().build(),
        model
      ).then(function (result) {
        browser.loaded()
        self.isProcessing(false)
        if (result.statusCode === 201) {
          self.listeners().forEach((l) => l.saveNeed(self))
        } else {
          self.handleError(result)
        }
      }, function (error) {
        self.handleError(error)
      })
    } else { // editing
      let endpoint = self.endpointBuilder.serviceProviders(self.serviceProviderId).needs(self.id()).build()
      ajax.put(endpoint,
        model
      ).then(function (result) {
        self.isProcessing(false)
        if (result.statusCode === 200) {
          self.listeners().forEach((l) => l.saveNeed(self))
        } else {
          self.handleError(result)
        }
      }, function (error) {
        self.handleError(error)
      })
    }
  }

  self.addListener = function (listener) {
    self.listeners().push(listener)
  }

  if (self.id()) {
    ajax
      .get(`${self.endpoints.serviceProviderNeeds(self.id()).build()}/offers-to-help`)
      .then((result) => {
        self.totalResponses(result.data.helpOffers.length)
      })
  }
}

Need.prototype = new BaseViewModel()

module.exports = Need
