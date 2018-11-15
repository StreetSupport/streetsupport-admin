'use strict'

const ListingBaseViewModel = require('../ListingBaseViewModel')
const ItemOfferer = require('./ItemOfferer')
const ko = require('knockout')
import { cities as locations } from '../../../data/generated/supported-cities'
const auth = require('../../auth')
import { categories } from '../../../data/generated/need-categories'

const ListModel = function () {
  const self = this

  self.archived = (id) => {
    self.items(self.items()
      .filter((v) => v.id !== id))
  }

  const hasValue = (val) => val !== undefined && val.length > 0
  self.filters = [
    { key: 'searchTerm', getValue: (vm) => vm.nameToFilterOn(), isSet: hasValue },
    { key: 'category', getValue: (vm) => vm.categoryToFilterOn(), isSet: hasValue },
    { key: 'location', getValue: (vm) => vm.locationToFilterOn(), isSet: hasValue }
  ]

  self.mapItems = (i) => { return new ItemOfferer(i, self) }
  self.baseUrl = self.endpointBuilder.offersOfItems().build()

  const locationsForUser = auth.isCityAdmin()
    ? locations.filter((l) => auth.locationsAdminFor().includes(l.id))
    : locations
  self.shouldShowLocationFilter = ko.computed(function () {
    return locationsForUser.length > 1
  }, self)
  self.availableLocations = ko.observableArray(locationsForUser)
  self.categories = ko.observableArray(categories)
  self.locationToFilterOn = ko.observable()
  self.nameToFilterOn = ko.observable()
  self.categoryToFilterOn = ko.observable()

  self.init(self)
}

ListModel.prototype = new ListingBaseViewModel()

module.exports = ListModel
