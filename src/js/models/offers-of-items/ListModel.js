'use strict'

const ListingBaseViewModel = require('../ListingBaseViewModel')
const ItemOfferer = require('./ItemOfferer')
const ko = require('knockout')
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
    { key: 'searchTerm', setValue: (vm, value) => vm.nameToFilterOn(value), getValue: (vm) => vm.nameToFilterOn(), isSet: hasValue },
    { key: 'category', setValue: (vm, value) => vm.categoryToFilterOn(value), getValue: (vm) => vm.categoryToFilterOn(), isSet: hasValue },
    { key: 'location', setValue: (vm, value) => vm.locationToFilterOn(value), getValue: (vm) => vm.locationToFilterOn(), isSet: hasValue }
  ]

  self.mapItems = (i) => { return new ItemOfferer(i, self) }
  self.baseUrl = self.endpointBuilder.offersOfItems().build()

  self.availableLocations = ko.observableArray(auth.getLocationsForUser())
  self.shouldShowLocationFilter = ko.computed(function () {
    return self.availableLocations().length > 1
  }, self)
  self.categories = ko.observableArray(categories)
  self.locationToFilterOn = ko.observable()
  self.nameToFilterOn = ko.observable()
  self.categoryToFilterOn = ko.observable()

  self.init(self)
}

ListModel.prototype = new ListingBaseViewModel()

module.exports = ListModel
