const ajax = require('../../ajax')
const BaseViewModel = require('../../models/BaseViewModel')
const browser = require('../../browser')
const cookies = require('../../cookies')
const querystring = require('../../get-url-parameter')
const validation = require('../../validation')

const ko = require('knockout')
require('knockout.validation') // No variable here is deliberate!

function InlineEditableSubEntity (formFields, endpoint) {
  const self = this

  self.originalData = {}
  self.isEditable = ko.observable(false)
  self.patchEndpoint = endpoint

  self.formFields = formFields

  self.edit = () => {
    self.isEditable(true)
  }

  self.resetData = () => {
    Object.keys(self.originalData)
      .forEach((k) => {
        self.formFields()[k](self.originalData[k])
      })
  }

  self.populateFormFields = (data) => {
    Object.keys(self.formFields())
      .forEach((k) => {
        self.formFields()[k](data[k])
      })
    self.updateRestoreState()
  }

  self.updateRestoreState = () => {
    Object.keys(self.formFields())
      .forEach((k) => {
        self.originalData[k] = self.formFields()[k]()
      })
  }

  self.cancel = () => {
    self.resetData()
    self.isEditable(false)
  }

  self.save = () => {
    browser.loading()
    const headers = self.headers(cookies.get('session-token'))
    const payload = validation.buildPayload(self.formFields())
    ajax
      .patch(self.patchEndpoint, headers, payload)
      .then((result) => {
        self.isEditable(false)
        self.updateRestoreState()
        browser.loaded()
      })
  }
}

InlineEditableSubEntity.prototype = new BaseViewModel()

function Model () {
  const self = this
  const id = querystring.parameter('id')
  const headers = self.headers(cookies.get('session-token'))

  self.buildContactDetails = () => {
    const formFields = ko.validatedObservable({
      name: ko.observable().extend({ required: true }),
      additionalInfo: ko.observable().extend({ required: true }),
      email: ko.observable().extend({ email: true }),
      telephone: ko.observable()
    })
    const endpoint = self.endpointBuilder.temporaryAccommodation(id).contactInformation().build()
    return new InlineEditableSubEntity(formFields, endpoint)
  }

  self.contactDetails = ko.observable(self.buildContactDetails(id))

  self.init = () => {
    browser.loading()
    ajax
      .get(self.endpointBuilder.temporaryAccommodation(id).build(), headers)
      .then((result) => {
        self.contactDetails().populateFormFields(result.data.contactInformation)
        browser.loaded()
      })
  }
}

Model.prototype = new BaseViewModel()

module.exports = Model
