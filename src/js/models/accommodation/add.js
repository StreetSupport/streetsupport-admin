const htmlEncode = require('htmlencode')

const ajax = require('../../ajax')
const BaseViewModel = require('../../models/BaseViewModel')
const auth = require('../../auth')
const browser = require('../../browser')
const endpoints = require('../../api-endpoints')
const validation = require('../../validation')
const querystring = require('../../get-url-parameter')

import { categories } from '../../../data/generated/accommodation-categories'
import { supportTypes } from '../../../data/generated/support-types'

require('../../arrayExtensions')

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
    serviceProviderId: ko.observable(auth.providerAdminFor()),
    contactName: ko.observable(),
    email: ko.observable().extend({ email: true }),
    telephone: ko.observable(),
    addressLine1: ko.observable().extend({ required: true }),
    addressLine2: ko.observable(),
    addressLine3: ko.observable(),
    city: ko.observable().extend({ required: true }),
    locationId: ko.observable().extend({ required: true }),
    postcode: ko.observable().extend({ required: true }),
    addressIsPubliclyHidden: ko.observable(false)
  })

  self.locations = ko.observableArray(auth.getLocationsForUser())
  self.shouldShowLocations = ko.computed(() => self.locations().length > 1, self)
  self.accommodationTypes = ko.observableArray(categories)

  self.supportTypes = ko.observableArray(supportTypes.map((t) => {
    return {
      'key': t.key,
      'name': t.name,
      'isSelected': false
    }
  }))

  self.serviceProviders = ko.observableArray()
  self.formSubmitted = ko.observable(false)
  self.formSubmissionSuccessful = ko.observable(false)
  self.formSubmissionNotSuccessful = ko.observable(false)
  self.editNewItemUrl = ko.observable()

  self.loadServiceProviders = (locationId) => {
    if (auth.isSuperAdmin() || auth.isCityAdmin()) {
      ajax
        .get(`${endpoints.getServiceProvidersv3}?location=${locationId}`)
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
          self.formFields().serviceProviderId(presetProviderId)
        }, () => {
          self.handleServerError()
        })
    }
  }

  self.formFields().locationId.subscribe((newLocationId) => {
    self.loadServiceProviders(newLocationId)
  })

  self.init = () => {
    validation.initialise(ko.validation)
    self.fieldErrors = validation.getValidationGroup(ko.validation, self.formFields)

    if (self.locations().length === 1) {
      self.formFields().locationId(self.locations()[0].id)
    }
  }

  self.postData = () => {
    browser.loading()
    const endpoint = endpoints.temporaryAccommodation
    const payload = validation.buildPayload(self.formFields())

    console.log(payload)

    self.formSubmitted(true)
    self.formSubmissionNotSuccessful(false)

    ajax
      .post(endpoint, payload)
      .then((result) => {
        browser.loaded()

        if (result.statusCode === 201) {
          self.formSubmissionSuccessful(true)
          self.editNewItemUrl(`/accommodation/edit/?id=${result.data.id}`)
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
