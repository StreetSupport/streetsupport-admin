const ko = require('knockout')
const htmlencode = require('htmlencode')

const auth = require('../../auth')
const ListingBaseViewModel = require('../ListingBaseViewModel')

const Model = function () {
  const self = this

  self.availableLocations = ko.observableArray(auth.getLocationsForUser([{ id: 'general', name: 'General Advice' }]))

  self.shouldShowLocationFilter = ko.computed(function () {
    return self.availableLocations().length > 1
  }, self)

  self.locationToFilterOn = ko.observable()
  self.nameToFilterOn = ko.observable()

  self.mapItems = (i) => {
    return {
      id: ko.observable(i.id),
      editUrl: ko.observable(`edit?id=${i.id}`),
      title: ko.observable(htmlencode.htmlDecode(i.title)),
      locationKey: ko.observable(i.locationKey),
      tags: ko.observable(i.tags)
    }
  }
  self.filters = [
    { key: 'searchTerm', setValue: (vm, value) => vm.nameToFilterOn(value), getValue: (vm) => vm.nameToFilterOn(), isSet: (val) => val !== undefined && val.length > 0 },
    { key: 'location', setValue: (vm, value) => vm.locationToFilterOn(value), getValue: (vm) => vm.locationToFilterOn(), isSet: (val) => val !== undefined && val.length > 0 }
  ]
  self.baseUrl = self.endpointBuilder.faqs().build()

  self.init(self)
}

Model.prototype = new ListingBaseViewModel()

module.exports = Model
