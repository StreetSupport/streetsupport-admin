'use strict'

import { clientGroups } from '../../data/generated/client-groups'
var ko = require('knockout')
var htmlencode = require('htmlencode')
var ajax = require('../ajax')
var Endpoints = require('../endpoint-builder')
var getUrlParameter = require('../get-url-parameter')
var OpeningTime = require('./OpeningTime')
var Address = require('./GroupedServiceAddress')
var BaseViewModel = require('./BaseViewModel')
var adminUrls = require('../admin-urls')

let buildTags = (tags) => {
  return tags !== null
    ? tags.join(', ')
    : ''
}

function Service (data) {
  var self = this
  self.serviceProviderId = data.serviceProviderId
  self.id = ko.observable(data.id)
  self.name = data.categoryName
  self.categoryId = data.categoryId
  self.info = ko.observable(htmlencode.htmlDecode(data.info))
  self.locationDescription = ko.observable(htmlencode.htmlDecode(data.location.description))
  self.subCategories = ko.observableArray()
  self.tags = ko.observable(buildTags(data.tags))
  self.subCatList = ko.observable(buildTags(data.subCategories.map((sc) => sc.name)))
  self.isOpen247 = ko.observable(data.isOpen247 !== undefined ? data.isOpen247 : false)
  self.isTelephoneService = ko.observable(data.isTelephoneService !== undefined ? data.isTelephoneService : false)
  self.isAppointmentOnly = ko.observable(data.isAppointmentOnly !== undefined ? data.isAppointmentOnly : false)
  self.openingTimes = ko.observableArray(data.openingTimes.map((ot) => new OpeningTime(ot)))
  data.location.telephone = data.telephone // telephone is not associated with address on edit
  self.address = new Address(data.location)
  self.message = ko.observable()
  self.endpoints = new Endpoints()
  self.listeners = ko.observableArray()
  self.editServiceUrl = adminUrls.serviceProviderServicesEdit + '?providerId=' + data.serviceProviderId + '&serviceId=' + data.id
  self.clientGroups = ko.observable(data.clientGroupKeys)
  self.availableClientGroups = ko.observableArray(clientGroups)
  self.newOpeningTime = function () {
    var openingTimes = self.openingTimes()
    openingTimes.push(new OpeningTime({
      'day': '',
      'startTime': '',
      'endTime': ''
    }))
    self.openingTimes(openingTimes)
  }

  self.duplicateOpeningTime = (source) => {
    let orig = self.openingTimes()
    orig.push(new OpeningTime({
      day: source.day(),
      startTime: source.startTime(),
      endTime: source.endTime()
    }))
    self.openingTimes(orig)
  }

  self.removeOpeningTime = function (openingTimeToRemove) {
    var notToBeRemoved = function (o) {
      return o.day() !== openingTimeToRemove.day() ||
             o.startTime() !== openingTimeToRemove.startTime() ||
             o.endTime() !== openingTimeToRemove.endTime()
    }
    var remaining = self.openingTimes().filter((o) => notToBeRemoved(o))

    self.openingTimes(remaining)
  }

  self.save = function () {
    var endpoint = self.endpointBuilder.serviceProviders(self.serviceProviderId).services(self.id()).build()

    var tags = []
    if (self.tags().length > 0) tags = self.tags().split(',').map((t) => t.trim())

    var model = {
      'Info': self.info(),
      'Tags': tags,
      'OpeningTimes': self.openingTimes().map((openingTime) => {
        return {
          'StartTime': openingTime.startTime(),
          'EndTime': openingTime.endTime(),
          'Day': openingTime.day()
        }
      }),
      'LocationDescription': self.locationDescription(),
      'Street1': self.address.street1(),
      'Street2': self.address.street2(),
      'Street3': self.address.street3(),
      'Street4': self.address.street4(),
      'City': self.address.city(),
      'Postcode': self.address.postcode(),
      'Telephone': self.address.telephone(),
      'IsOpen247': self.isOpen247(),
      'IsTelephoneService': self.isTelephoneService(),
      'IsAppointmentOnly': self.isAppointmentOnly(),
      'SubCategories': self.subCategories().filter((sc) => sc.isSelected()).map((sc) => sc.id()),
      'ClientGroupKeys': self.clientGroups()
    }

    ajax.put(endpoint,
      model
    ).then(function (result) {
      if (result.statusCode === 200) {
        self.listeners().forEach((l) => l.serviceSaved(self))
      } else {
        self.handleError(result)
      }
    }, function (error) {
      self.handleServerError(error)
    })
  }

  self.deleteService = function () {
    var endpoint = self.endpointBuilder.serviceProviders(getUrlParameter.parameter('key')).services(self.id()).build()
    ajax.delete(endpoint)
    .then(function (result) {
      self.listeners().forEach((l) => l.deleteGroupedService(self))
    }, function (error) {
      self.handleError(error)
    })
  }

  self.addListener = function (listener) {
    self.listeners().push(listener)
  }
}

Service.prototype = new BaseViewModel()

module.exports = Service
