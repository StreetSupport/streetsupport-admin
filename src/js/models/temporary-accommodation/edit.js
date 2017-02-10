const ajax = require('../../ajax')
const BaseViewModel = require('../../models/BaseViewModel')
const browser = require('../../browser')
const cookies = require('../../cookies')
const querystring = require('../../get-url-parameter')
const validation = require('../../validation')

const ko = require('knockout')
require('knockout.validation') // No variable here is deliberate!

function ContactDetails (rootId, data) {
  const self = this

  self.rootId = rootId
  self.originalData = data
  self.isEditable = ko.observable(false)

  self.formFields = ko.validatedObservable({
    name: ko.observable(data.name).extend({ required: true }),
    additionalInfo: ko.observable(data.additionalInfo).extend({ required: true }),
    email: ko.observable(data.email).extend({ email: true }),
    telephone: ko.observable(data.telephone)
  })

  self.edit = () => {
    self.isEditable(true)
  }

  self.resetData = () => {
    Object.keys(data)
      .forEach((k) => {
        self.formFields()[k](data[k])
      })
  }

  self.updateRestoreState = () => {
    Object.keys(data)
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
    const endpoint = self.endpointBuilder.temporaryAccommodation(rootId).contactInformation().build()
    const headers = self.headers(cookies.get('session-token'))
    const payload = validation.buildPayload(self.formFields())
    ajax
      .patch(endpoint, headers, payload)
      .then((result) => {
        self.isEditable(false)
        self.updateRestoreState()
        browser.loaded()
      })
  }
}

ContactDetails.prototype = new BaseViewModel()

function Model () {
  const self = this

  self.contactDetails = ko.observable()

  self.init = () => {
    const headers = self.headers(cookies.get('session-token'))
    const id = querystring.parameter('id')

    browser.loading()

    ajax
      .get(self.endpointBuilder.temporaryAccommodation(id).build(), headers)
      .then((result) => {
        self.contactDetails(new ContactDetails(id, result.data.contactInformation))

        browser.loaded()
      })
  }
}

Model.prototype = new BaseViewModel()

module.exports = Model
