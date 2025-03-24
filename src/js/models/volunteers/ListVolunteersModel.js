'use strict'
import { categories as volCategories } from '../../../data/generated/volunteer-categories.js'

const auth = require('../../auth')
const ListingBaseViewModel = require('../ListingBaseViewModel')
const ko = require('knockout')
const Volunteer = require('./Volunteer')
const htmlencode = require('htmlencode')

const ListVolunteersModel = function () {
  const self = this

  self.searchTerm = ko.observable()
  self.isFilteredByHighlighted = ko.observable(false)
  self.cityFilter = ko.observable()
  self.availableLocations = ko.observableArray(auth.getLocationsForUser())
  self.volCategories = ko.observableArray(volCategories)

  self.locationToFilterOn = ko.observable()
  self.volCategoryToFilterOn = ko.observable()
  self.textSearchToFilterOn = ko.observable()
  self.filterOnIsArchived = ko.observable('')
  self.filterOnIsOptedIn = ko.observable('')

  self.shouldShowLocationFilter = ko.computed(function () {
    return self.availableLocations().length > 1
  }, self)

  self.mapItems = (i) => new Volunteer(i, self)
  self.mapCsvItems = (i) => {
    return {
      name: ko.observable(`${i.person.firstName} ${i.person.lastName}`),
      email: ko.observable(i.person.email),
      skillsCats: ko.observable(i.skillsAndExperience.categories.join(', ')),
      skillsDesc: ko.observable(htmlencode.htmlDecode(i.skillsAndExperience.description)),
      availability: ko.observable(htmlencode.htmlDecode(i.availability.description)),
      resources: ko.observable(htmlencode.htmlDecode(i.resources.description))
    }
  }
  self.filters = [
    { key: 'location', setValue: (vm, value) => vm.locationToFilterOn(value), getValue: (vm) => vm.locationToFilterOn(), isSet: (val) => val !== undefined && val.length > 0 },
    { key: 'skillsCategory', setValue: (vm, value) => vm.volCategoryToFilterOn(value), getValue: (vm) => vm.volCategoryToFilterOn(), isSet: (val) => val !== undefined && val.length > 0 },
    { key: 'search', setValue: (vm, value) => vm.textSearchToFilterOn(value), getValue: (vm) => vm.textSearchToFilterOn(), isSet: (val) => val !== undefined && val.length > 0 },
    { key: 'isArchived', setValue: (vm, value) => vm.filterOnIsArchived(Boolean(value)), getValue: (vm) => vm.filterOnIsArchived(), isSet: (val) => val !== '' },
    { key: 'isOptedIn', setValue: (vm, value) => vm.filterOnIsOptedIn(Boolean(value)), getValue: (vm) => vm.filterOnIsOptedIn(), isSet: (val) => val !== '' }
  ]
  self.baseUrl = self.endpointBuilder.volunteers().build()

  self.archived = (id) => {
    self.items(self.items()
      .filter((v) => v.id !== id))
  }

  self.init(self)
}

ListVolunteersModel.prototype = new ListingBaseViewModel()

module.exports = ListVolunteersModel
