const ajax = require('../../ajax')
const BaseViewModel = require('../../models/BaseViewModel')
const browser = require('../../browser')
const cookies = require('../../cookies')
const endpoints = require('../../api-endpoints')
const validation = require('../../validation')

require('knockout.validation') // No variable here is deliberate!

const ko = require('knockout')

function Model () {
  const self = this

  self.formFields = ko.validatedObservable({
    name: ko.observable().extend({ required: true }),
    additionalInfo: ko.observable().extend({ required: true }),
    email: ko.observable().extend({ email: true }),
    telephone: ko.observable(),
    addressLine1: ko.observable().extend({ required: true }),
    addressLine2: ko.observable(),
    addressLine3: ko.observable(),
    city: ko.observable().extend({ required: true }),
    postcode: ko.observable().extend({ required: true })
  })

  self.formSubmitted = ko.observable(false)
  self.formSubmissionSuccessful = ko.observable(false)

  self.init = () => {
    validation.initialise(ko.validation)
    self.fieldErrors = validation.getValidationGroup(ko.validation, self.formFields)
  }

  self.postData = () => {
    const endpoint = endpoints.temporaryAccommodation
    const payload = validation.buildPayload(self.formFields())
    const headers = self.headers(cookies.get('session-token'))

    browser.loading()

    ajax
      .post(endpoint, headers, payload)
      .then((result) => {
        self.formSubmitted(true)
        self.formSubmissionSuccessful(true)
        browser.loaded()
      }, () => {

      })
  }

  self.save = () => {
    if (self.formFields.isValid()) {
      self.postData()
    } else {
      validation.showErrors(self.fieldErrors)
    }
  }
}

Model.prototype = new BaseViewModel()

module.exports = Model
