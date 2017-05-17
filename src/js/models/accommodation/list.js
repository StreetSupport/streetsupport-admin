const adminUrls = require('../../admin-urls')
const ajax = require('../../ajax')
const auth = require('../../auth')
const browser = require('../../browser')
const cookies = require('../../cookies')
const endpoints = require('../../api-endpoints')

const BaseViewModel = require('../BaseViewModel')

const ko = require('knockout')

import { cities } from '../../../data/generated/supported-cities'

const formatData = (data) => {
  const formatted = data
  formatted
      .forEach((i) => {
        i.editUrl = `${adminUrls.temporaryAccommodation}/edit?id=${i.id}`
        i.addReviewsUrl = `${adminUrls.temporaryAccommodation}/reviews/add?id=${i.id}`
        i.reviewsListingUrl = `${adminUrls.temporaryAccommodation}/reviews?id=${i.id}`
        i.userCanSeeReviews = auth.canSeeReviews()
      })
  return formatted
}

function Lister () {
  const self = this

  self.entries = ko.observableArray()
  self.canLoadMore = ko.observable(false)
  self.loadNextUrl = endpoints.temporaryAccommodation
  self.cities = ko.observableArray(cities)
  self.selectedCityFilter = ko.observable()

  self.init = () => {
    self.loadNext()
  }

  self.selectedCityFilter.subscribe((newCityToFilterOn) => {
    self.loadNextUrl = `${endpoints.temporaryAccommodation}?cityId=${newCityToFilterOn}&pageSize=2`

    browser.loading()
    ajax.get(self.loadNextUrl, self.headers(cookies.get('session-token')))
      .then((result) => {
        self.entries(formatData(result.data.items))

        self.loadNextUrl = endpoints.prefix(result.data.links.next)

        self.canLoadMore(result.data.links.next !== null)

        browser.loaded()
      }, () => {

      })
  })

  self.loadNext = () => {
    browser.loading()
    ajax.get(self.loadNextUrl, self.headers(cookies.get('session-token')))
      .then((result) => {
        const newEntries = [...self.entries(), ...formatData(result.data.items)]
        self.entries(newEntries)

        self.loadNextUrl = endpoints.prefix(result.data.links.next)

        self.canLoadMore(result.data.links.next !== null)

        browser.loaded()
      }, () => {

      })
  }
}

Lister.prototype = new BaseViewModel()

module.exports = Lister
