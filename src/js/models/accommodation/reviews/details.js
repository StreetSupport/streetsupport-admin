import { buildModel, buildFeedback } from './review'

const ko = require('knockout')
require('knockout.validation') // No variable here is deliberate!

const ajax = require('../../../ajax')
const browser = require('../../../browser')
const querystring = require('../../../get-url-parameter')
const BaseViewModel = require('../../BaseViewModel')

function Details () {
  const self = this

  const accomId = querystring.parameter('accom-id')
  const id = querystring.parameter('id')

  self.review = ko.observable()
  self.feedback = ko.observable()

  self.reviewListingUrl = ko.observable(`../?id=${accomId}`)

  const retrieveItems = () => {
    browser.loading()
    const endpoint = `${self.endpointBuilder.temporaryAccommodation(accomId).build()}/reviews/${id}`
    ajax
      .get(endpoint)
      .then((result) => {
        self.review(buildModel(result.data))
        self.feedback(buildFeedback(result.data))
        browser.loaded()
      }, () => {
        self.handleServerError()
      })
  }

  self.init = () => {
    retrieveItems()
  }

  self.init()
}

Details.prototype = new BaseViewModel()

module.exports = Details
