'use strict'

const auth = require('../../auth')
const ListingBaseViewModel = require('../ListingBaseViewModel')
const ko = require('knockout')
const Volunteer = require('./Volunteer')

import { cities as locations } from '../../../data/generated/supported-cities'
import { categories as volCategories } from '../../../data/generated/volunteer-categories.js'

const ListVolunteersModel = function () {
  const self = this

  const locationsForUser = auth.isCityAdmin()
    ? locations.filter((l) => auth.locationsAdminFor().includes(l.id))
    : locations

  self.searchTerm = ko.observable()
  self.isFilteredByHighlighted = ko.observable(false)
  self.cityFilter = ko.observable()
  self.availableLocations = ko.observableArray(locationsForUser)
  self.volCategories = ko.observableArray(volCategories)

  self.locationToFilterOn = ko.observable()
  self.volCategoryToFilterOn = ko.observable()
  self.textSearchToFilterOn = ko.observable()
  self.filterOnIsArchived = ko.observable('')

  self.shouldShowLocationFilter = ko.computed(function () {
    return locationsForUser.length > 1
  }, self)

  self.mapItems = (i) =>  new Volunteer(i, self)
  self.mapCsvItems = (i) => {
    return {
      name: ko.observable(`${i.person.firstName} ${i.person.lastName}`),
      email: ko.observable(`${i.person.email}`)
    }
  }
  self.filters = [
    { key: 'location', getValue: (vm) => vm.locationToFilterOn(), isSet: (val) => val !== undefined && val.length > 0 },
    { key: 'skillsCategory', getValue: (vm) => vm.volCategoryToFilterOn(), isSet: (val) => val !== undefined && val.length > 0 },
    { key: 'search', getValue: (vm) => vm.textSearchToFilterOn(), isSet: (val) => val !== undefined && val.length > 0 },
    { key: 'isArchived', getValue: (vm) => vm.filterOnIsArchived(), isSet: (val) => val !== '' }
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
