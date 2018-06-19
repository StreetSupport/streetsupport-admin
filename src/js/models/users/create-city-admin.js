const ajax = require('../../ajax')
const BaseViewModel = require('../../models/BaseViewModel')
const browser = require('../../browser')
const cookies = require('../../cookies')
const endpoints = require('../../api-endpoints')
const validation = require('../../validation')

import { cities } from '../../../data/generated/supported-cities'

const ko = require('knockout')
require('knockout.validation') // No variable here is deliberate!

function Model () {
  const self = this

  self.formFields = ko.validatedObservable({
    email: ko.observable().extend({ email: true, required: true }),
    cityId: ko.observable().extend({ required: true })
  })

  self.cities = ko.observableArray(cities)

  self.formSubmitted = ko.observable(false)
  self.formSubmissionSuccessful = ko.observable(false)
  self.formSubmissionNotSuccessful = ko.observable(false)

  self.init = () => {
    validation.initialise(ko.validation)
    self.fieldErrors = validation.getValidationGroup(ko.validation, self.formFields)
  }

  self.postData = () => {
    browser.loading()
    const endpoint = endpoints.unverifiedCityAdmins
    const payload = validation.buildPayload(self.formFields())
    self.formSubmitted(true)
    self.formSubmissionNotSuccessful(false)

    ajax
      .post(endpoint, payload)
      .then((result) => {
        browser.loaded()

        if (result.statusCode === 201) {
          self.formSubmissionSuccessful(true)
        } else {
          self.formSubmitted(false)
          self.formSubmissionNotSuccessful(true)
          self.handleError(result)
        }
      }, () => {
        self.handleServerError()
      })
  }

  self.save = () => {
    if (self.formFields.isValid()) {
      self.postData()
    } else {
      validation.showErrors(self.fieldErrors)
    }
  }

  self.reset = () => {
    const formFieldKeys = Object.keys(self.formFields())
    formFieldKeys
      .forEach((k) => {
        self.formFields()[k](null)
      })
    self.formSubmitted(false)
    self.formSubmissionSuccessful(false)
    self.formSubmissionNotSuccessful(false)
  }
}

Model.prototype = new BaseViewModel()

module.exports = Model
