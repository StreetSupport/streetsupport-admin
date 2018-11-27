const adminUrls = require('../../admin-urls')
const ajax = require('../../ajax')
const auth = require('../../auth')
const endpoints = require('../../api-endpoints')
const querystring = require('../../get-url-parameter')

const ListingBaseViewModel = require('../ListingBaseViewModel')

const ko = require('knockout')
const htmlEncode = require('htmlencode')

require('../../arrayExtensions')

import { cities } from '../../../data/generated/supported-cities'

const mapItem = (i) => {
  i.editUrl = `${adminUrls.temporaryAccommodation}/edit?id=${i.id}`
  i.addReviewsUrl = `${adminUrls.temporaryAccommodation}/reviews/add?id=${i.id}`
  i.reviewsListingUrl = `${adminUrls.temporaryAccommodation}/reviews?id=${i.id}`
  i.addAccomProviderUrl = `/users/create-accom-provider-admin?id=${i.id}`
  i.canAddProviderAdmin = i.serviceProviderId === null
  i.userCanSeeReviews = auth.canSeeReviews()

  return i
}

function Lister () {
  const self = this

  self.cities = ko.observableArray(cities)
  self.shouldShowLocationFilter = ko.computed(() => self.cities().length > 1, self)
  self.nameToFilterOn = ko.observable()
  self.locationToFilterOn = ko.observable()
  self.providerIdToFilterOn = ko.observable(querystring.parameter('providerId'))
  self.serviceProviders = ko.observableArray()

  if (auth.isSuperAdmin() || auth.isCityAdmin()) {
    ajax
      .get(endpoints.getServiceProvidersHAL)
      .then((result) => {
        self.serviceProviders(result.data.items
          .map(p => {
            return {
              key: p.key,
              name: htmlEncode.htmlDecode(p.name)
            }
          })
          .sortAsc('name')
        )

        const presetProviderId = auth.providerAdminFor() || querystring.parameter('providerId')
        self.providerIdToFilterOn(presetProviderId)
      }, () => {
        self.handleServerError()
      })
  }

  self.filters = [
    { key: 'providerId', getValue: (vm) => vm.providerIdToFilterOn(), isSet: (val) => val !== undefined && val.length > 0 },
    { key: 'name', getValue: (vm) => vm.nameToFilterOn(), isSet: (val) => val !== undefined && val.length > 0 },
    { key: 'location', getValue: (vm) => vm.locationToFilterOn(), isSet: (val) => val !== undefined && val.length > 0 }
  ]
  self.mapItems = mapItem
  self.baseUrl = endpoints.temporaryAccommodation

  self.init(self)
}

Lister.prototype = new ListingBaseViewModel()

module.exports = Lister
