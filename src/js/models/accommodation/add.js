const ajax = require('../../ajax')
const BaseViewModel = require('../../models/BaseViewModel')
const browser = require('../../browser')
const cookies = require('../../cookies')
const endpoints = require('../../api-endpoints')
const validation = require('../../validation')

import { categories } from '../../../data/generated/service-categories'
import { supportTypes } from '../../../data/generated/support-types'

const ko = require('knockout')
require('knockout.validation') // No variable here is deliberate!

function Model () {
  const self = this

  self.formFields = ko.validatedObservable({
    name: ko.observable().extend({ required: true }),
    synopsis: ko.observable(),
    description: ko.observable(),
    isOpenAccess: ko.observable(false),
    accommodationType: ko.observable(),
    supportOffered: ko.observableArray(),
    serviceProviderId: ko.observable(),
    contactName: ko.observable(),
    email: ko.observable().extend({ email: true }),
    telephone: ko.observable(),
    addressLine1: ko.observable().extend({ required: true }),
    addressLine2: ko.observable(),
    addressLine3: ko.observable(),
    city: ko.observable().extend({ required: true }),
    postcode: ko.observable().extend({ required: true })
  })

  self.accommodationTypes = ko.observableArray(categories
    .find((sc) => sc.key === 'accom')
    .subCategories)

  self.supportTypes = ko.observableArray(supportTypes.map((t) => {
    return {
      'key': t.key,
      'name': t.name,
      'isSelected': false
    }
  }))

  self.formSubmitted = ko.observable(false)
  self.formSubmissionSuccessful = ko.observable(false)
  self.formSubmissionNotSuccessful = ko.observable(false)

  self.init = () => {
    validation.initialise(ko.validation)
    self.fieldErrors = validation.getValidationGroup(ko.validation, self.formFields)
  }

  self.postData = () => {
    const endpoint = endpoints.temporaryAccommodation
    const payload = validation.buildPayload(self.formFields())
    const headers = self.headers(cookies.get('session-token'))

    browser.loading()
    self.formSubmitted(true)
    self.formSubmissionNotSuccessful(false)

    ajax
      .post(endpoint, headers, payload)
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
