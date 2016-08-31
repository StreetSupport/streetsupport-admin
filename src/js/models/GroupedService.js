var ko = require('knockout')
var ajax = require('../ajax')
var Endpoints = require('../endpoint-builder')
var getUrlParameter = require('../get-url-parameter')
var cookies = require('../cookies')
var OpeningTime = require('./OpeningTime')
var Address = require('./GroupedServiceAddress')
var BaseViewModel = require('./BaseViewModel')
var adminUrls = require('../admin-urls')

function Service (data) {
  var self = this
  self.serviceProviderId = data.serviceProviderId
  self.id = ko.observable(data.id)
  self.name = data.categoryName
  self.categoryId = data.categoryId
  self.info = ko.observable(data.info)
  self.locationDescription = ko.observable(data.location.description)
  self.subCategories = ko.observableArray()

  var tags = data.tags !== null ? data.tags.join(', ') : ''

  self.tags = ko.observable(tags)

  self.openingTimes = ko.observableArray(data.openingTimes.map((ot) => new OpeningTime(ot)))

  self.address = new Address(data.location)

  self.savedName = ko.observable(data.name)
  self.savedInfo = ko.observable(data.info)
  self.savedTags = ko.observable(tags)
  self.savedOpeningTimes = ko.observableArray(data.openingTimes.map((ot) => new OpeningTime(ot)))
  self.savedAddress = new Address(data.location)

  self.isEditing = ko.observable(false)
  self.message = ko.observable()
  self.endpoints = new Endpoints()
  self.listeners = ko.observableArray()

  self.editServiceUrl = adminUrls.serviceProviderServicesEdit + '?providerId=' + data.serviceProviderId + '&serviceId=' + data.categoryId

  self.edit = function () {
    self.isEditing(true)
  }

  self.cancelEdit = function () {
    self.restoreFields()
  }

  self.restoreFields = function () {
    self.isEditing(false)
    self.info(self.savedInfo())
    self.tags(self.savedTags())

    var restoredOpeningTimes = self.savedOpeningTimes().map((ot) => {
      return new OpeningTime({
        'day': ot.day(),
        'startTime': ot.startTime(),
        'endTime': ot.endTime()
      })
    })
    self.openingTimes(restoredOpeningTimes)
  }

  self.newOpeningTime = function () {
    var openingTimes = self.openingTimes()
    openingTimes.push(new OpeningTime({
      'day': '',
      'startTime': '',
      'endTime': ''
    }))
    self.openingTimes(openingTimes)
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
      'SubCategories': self.subCategories().filter((sc) => sc.isSelected()).map((sc) => sc.id())
    }

    ajax.put(endpoint,
      self.headers(cookies.get('session-token')),
      model
    ).then(function (result) {
      self.isEditing(false)
      self.listeners().forEach((l) => l.serviceSaved(self))
    }, function (error) {
      self.handleError(error)
    })
  }

  self.deleteService = function () {
    var endpoint = self.endpointBuilder.serviceProviders(getUrlParameter.parameter('key')).services(self.id()).build()
    ajax.delete(endpoint, self.headers(cookies.get('session-token')))
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
