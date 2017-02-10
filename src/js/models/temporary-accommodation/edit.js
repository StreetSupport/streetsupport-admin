const ajax = require('../../ajax')
const BaseViewModel = require('../../models/BaseViewModel')
const browser = require('../../browser')
const cookies = require('../../cookies')
const InlineEditableSubEntity = require('../../models/InlineEditableSubEntity')
const querystring = require('../../get-url-parameter')

const ko = require('knockout')
require('knockout.validation') // No variable here is deliberate!

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

  self.buildAddress = () => {
    const formFields = ko.validatedObservable({
      street1: ko.observable().extend({ required: true }),
      street2: ko.observable(),
      street3: ko.observable(),
      city: ko.observable(),
      postcode: ko.observable(),
      publicTransportInfo: ko.observable(),
      nearestSupportProviderId: ko.observable()
    })
    const endpoint = self.endpointBuilder.temporaryAccommodation(id).contactInformation().build()
    return new InlineEditableSubEntity(formFields, endpoint)
  }

  self.contactDetails = ko.observable(self.buildContactDetails())
  self.address = ko.observable(self.buildAddress())

  self.init = () => {
    browser.loading()
    ajax
      .get(self.endpointBuilder.temporaryAccommodation(id).build(), headers)
      .then((result) => {
        self.contactDetails().populateFormFields(result.data.contactInformation)
        self.address().populateFormFields(result.data.address)
        browser.loaded()
      })
  }
}

Model.prototype = new BaseViewModel()

module.exports = Model
