const ajax = require('../../ajax')
const endpoints = require('../../api-endpoints')
const BaseViewModel = require('../../models/BaseViewModel')
const browser = require('../../browser')
const cookies = require('../../cookies')

const ko = require('knockout')

function Model () {
  const self = this

  self.formFields = ko.observable({
    name: ko.observable(),
    additionalInfo: ko.observable(),
    email: ko.observable(),
    telephone: ko.observable(),
    addressLine1: ko.observable(),
    addressLine2: ko.observable(),
    addressLine3: ko.observable(),
    city: ko.observable(),
    postcode: ko.observable()
  })

  self.formSubmitted = ko.observable(false)
  self.formSubmissionSuccessful = ko.observable(false)

  self.init = () => {
  }

  self.save = () => {
    browser.loading()

    const endpoint = endpoints.temporaryAccommodation
    const payload = {
      'Name': self.formFields().name(),
      'AdditionalInfo': self.formFields().additionalInfo(),
      'Email': self.formFields().email(),
      'Telephone': self.formFields().telephone(),
      'AddressLine1': self.formFields().addressLine1(),
      'AddressLine2': self.formFields().addressLine2(),
      'AddressLine3': self.formFields().addressLine3(),
      'City': self.formFields().city(),
      'Postcode': self.formFields().postcode()
    }
    const headers = self.headers(cookies.get('session-token'))

    ajax
      .post(endpoint, payload, headers)
      .then((result) => {
        self.formSubmitted(true)
        self.formSubmissionSuccessful(true)
        browser.loaded()
      }, () => {

      })
  }
}

Model.prototype = new BaseViewModel()

module.exports = Model
