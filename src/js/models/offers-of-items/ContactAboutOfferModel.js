'use strict'

var BaseViewModel = require('../BaseViewModel')
var ajax = require('../../ajax')
var browser = require('../../browser')
var getUrlParam = require('../../get-url-parameter')
var ko = require('knockout')
require('knockout.validation') // No variable here is deliberate!
var ItemOfferer = require('./ItemOfferer')

var ContactAboutOfferModel = function () {
  var self = this
  self.isFormSubmitSuccessful = ko.observable(false)
  self.isFormSubmitFailure = ko.observable(false)
  self.formModel = ko.validatedObservable({
    message: ko.observable().extend({ required: true }),
    isAnEmail: ko.observable()
  })
  self.fieldErrors = ko.validation.group(self.formModel)
  self.apiErrors = ko.observableArray()
  self.volunteer = ko.observable()

  ko.validation.init({
    insertMessages: true,
    decorateInputElement: true,
    parseInputAttributes: true,
    errorMessageClass: 'form__error',
    errorElementClass: 'form__input--error'
  }, true)

  const sendRequest = function (payload) {
    if (self.formModel.isValid()) {
      browser.loading()
      var endpoint = self.endpointBuilder.offersOfItems(getUrlParam.parameter('id')).build() + '/contact-requests'
      ajax
        .post(endpoint, payload)
        .then(function (res) {
          browser.loaded()
          if (res.status === 'error') {
            self.isFormSubmitFailure(true)
            self.showErrors(res)
          } else {
            self.isFormSubmitSuccessful(true)
          }
        }, function (res) {
          self.handleServerError(res)
        })
    } else {
      self.fieldErrors.showAllMessages()
    }
  }

  self.sendEmail = function () {
    const payload = {
      'Message': self.formModel().message(),
      'ShouldSendEmail': true
    }
    sendRequest(payload)
  }

  self.recordLog = function () {
    const payload = {
      'Message': self.formModel().message(),
      'ShouldSendEmail': false
    }
    sendRequest(payload)
  }

  const getEndpoint = self.endpointBuilder.offersOfItems(getUrlParam.parameter('id')).build()
  ajax
    .get(getEndpoint)
    .then((res) => {
      self.volunteer(new ItemOfferer(res.data))
      self.formModel().isAnEmail(self.volunteer().person.telephone.length === 0)
    }, () => {

    })
}

ContactAboutOfferModel.prototype = new BaseViewModel()

module.exports = ContactAboutOfferModel
