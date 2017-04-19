const adminUrls = require('../../admin-urls')
const ajax = require('../../ajax')
const endpoints = require('../../api-endpoints')
const browser = require('../../browser')
const cookies = require('../../cookies')
const BaseViewModel = require('../BaseViewModel')

const ko = require('knockout')

function Lister () {
  const self = this

  self.entries = ko.observableArray()
  self.canLoadMore = ko.observable(false)
  self.loadNextUrl = endpoints.temporaryAccommodation

  self.init = () => {
    self.loadNext()
  }

  self.loadNext = () => {
    browser.loading()
    ajax.get(self.loadNextUrl, self.headers(cookies.get('session-token')))
      .then((result) => {
        const formatted = result.data.items
        formatted
          .forEach((i) => {
            i.editUrl = `${adminUrls.temporaryAccommodation}/edit?id=${i.id}`
            i.addReviewsUrl = `${adminUrls.temporaryAccommodation}/reviews/add?id=${i.id}`
            i.reviewsListingUrl = `${adminUrls.temporaryAccommodation}/reviews?id=${i.id}`
          })
        const newEntries = [...self.entries(), ...formatted]
        self.entries(newEntries)

        self.loadNextUrl = endpoints.prefix(result.data.links.next)
        const canLoadMore = result.data.links.next !== null
        self.canLoadMore(canLoadMore)

        browser.loaded()
      }, () => {

      })
  }
}

Lister.prototype = new BaseViewModel()

module.exports = Lister
