const ko = require('knockout')
const htmlencode = require('htmlencode')

const auth = require('../../auth')
const ListingBaseViewModel = require('../ListingBaseViewModel')
import { cities as locations } from '../../../data/generated/supported-cities'

const Model = function () {
  const self = this

  const locationsForUser = auth.isCityAdmin()
    ? locations.filter((l) => auth.locationsAdminFor().includes(l.id))
    : [{ id: 'general', name: 'General Advice' }, ...locations]

  self.shouldShowLocationFilter = ko.computed(function () {
    return locationsForUser.length > 1
  }, self)
  self.availableLocations = ko.observableArray(locationsForUser)

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
    { key: 'searchTerm', getValue: (vm) => vm.nameToFilterOn(), isSet: (val) => val !== undefined && val.length > 0 },
    { key: 'location', getValue: (vm) => vm.locationToFilterOn(), isSet: (val) => val !== undefined && val.length > 0 },
 
  ]
  self.baseUrl = self.endpointBuilder.faqs().build()

  self.init(self)
}

Model.prototype = new ListingBaseViewModel()

module.exports = Model
