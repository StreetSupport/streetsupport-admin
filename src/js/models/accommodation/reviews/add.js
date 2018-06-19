let ko = require('knockout')
require('knockout.validation') // No variable here is deliberate!

let ajax = require('../../../ajax')
let browser = require('../../../browser')
let cookies = require('../../../cookies')
let querystring = require('../../../get-url-parameter')
let BaseViewModel = require('../../BaseViewModel')
let Item = require('./Item')

import * as review from './review'

function Add () {
  let self = this

  self.buildFormFields = (data = review.createDefaultNewItem(querystring.parameter('id'))) => {
    return ko.validatedObservable(review.buildModel(data))
  }
  self.buildEndpoints = () => {
    return {
      save: (item) => `${item.endpointBuilder.temporaryAccommodation(item.formFields().temporaryAccommodationIdReadOnly()).build()}/reviews`,
      delete: (item) => `${item.endpointBuilder.temporaryAccommodation(item.formFields().temporaryAccommodationIdReadOnly()).build()}/reviews/${item.formFields().idReadOnly()}`
    }
  }

  self.buildPersonalFeedbackFormFields = (data = review.createDefaultNewFeedback()) => {
    const model = ko.validatedObservable(review.buildFeedback(data))
    return model
  }
  self.buildPersonalFeedbackEndpoints = () => {
    return {
      update: (item) => `${item.endpointBuilder.temporaryAccommodation(item.formFields().temporaryAccommodationIdReadOnly()).build()}/reviews/${item.formFields().idReadOnly()}`
    }
  }

  self.newItem = ko.observable(new Item(self, self.buildFormFields(), self.buildEndpoints()))
  self.personalFeedback = ko.observable(new Item(self, self.buildPersonalFeedbackFormFields(), self.buildPersonalFeedbackEndpoints()))
  self.address = ko.observable()
  self.reviewIsCreated = ko.observable(false)
  self.personalFeedbackIsSent = ko.observable(false)

  self.itemCreated = (item) => {
    self.reviewIsCreated(true)
    self.personalFeedback().formFields().idReadOnly(item.formFields().idReadOnly())
    self.personalFeedback().formFields().temporaryAccommodationIdReadOnly(item.formFields().temporaryAccommodationIdReadOnly())
  }

  self.itemUpdated = () => {
    self.personalFeedbackIsSent(true)
    self.message('Thank you for your feedback!')
  }

  const retrieveItems = () => {
    browser.loading()
    const id = querystring.parameter('id')
    const endpoint = `${self.endpointBuilder.temporaryAccommodation(id).build()}`
    ajax
      .get(endpoint)
      .then((result) => {
        browser.loaded()

        self.newItem().formFields().temporaryAccommodationIdReadOnly(result.data.id)
        const address = [result.data.address.street1, result.data.address.street2, result.data.address.street3, result.data.address.city, result.data.address.postcode]
          .filter((l) => l != null)
          .join(', ')
        self.address(address)
      }, () => {
        self.handleServerError()
      })
  }

  self.init = () => {
    retrieveItems()
  }

  self.init()
}

Add.prototype = new BaseViewModel()

module.exports = Add
