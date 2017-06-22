let ko = require('knockout')
require('knockout.validation') // No variable here is deliberate!

let ajax = require('../../../ajax')
let browser = require('../../../browser')
let cookies = require('../../../cookies')
let querystring = require('../../../get-url-parameter')
let BaseViewModel = require('../../BaseViewModel')

import { buildModel, buildFeedback } from './review'

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
    const headers = self.headers(cookies.get('session-token'))
    ajax
      .get(endpoint, headers)
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
