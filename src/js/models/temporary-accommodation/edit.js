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

  self.contactDetails = ko.observable(self.buildContactDetails())

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
