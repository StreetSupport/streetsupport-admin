const adminUrls = require('../../admin-urls')
const auth = require('../../auth')
const endpoints = require('../../api-endpoints')

const ListingBaseViewModel = require('../ListingBaseViewModel')

const ko = require('knockout')

import { cities } from '../../../data/generated/supported-cities'

const mapItem = (i) => {
  i.editUrl = `${adminUrls.temporaryAccommodation}/edit?id=${i.id}`
  i.addReviewsUrl = `${adminUrls.temporaryAccommodation}/reviews/add?id=${i.id}`
  i.reviewsListingUrl = `${adminUrls.temporaryAccommodation}/reviews?id=${i.id}`
  i.userCanSeeReviews = auth.canSeeReviews()

  return i
}

function Lister () {
  const self = this

  self.cities = ko.observableArray(cities)
  self.shouldShowLocationFilter = ko.computed(() => self.cities().length > 1, self)
  self.nameToFilterOn = ko.observable()
  self.locationToFilterOn = ko.observable()

  self.filters = [
    { key: 'name', getValue: (vm) => vm.nameToFilterOn(), isSet: (val) => val !== undefined && val.length > 0 },
    { key: 'location', getValue: (vm) => vm.locationToFilterOn(), isSet: (val) => val !== undefined && val.length > 0 },
  ]
  self.mapItems = mapItem
  self.baseUrl = endpoints.temporaryAccommodation

  self.init(self)
}

Lister.prototype = new ListingBaseViewModel()

module.exports = Lister
