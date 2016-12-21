'use strict'

var BaseViewModel = require('../BaseViewModel')
var ajax = require('../../ajax')
var browser = require('../../browser')
var cookies = require('../../cookies')
var getUrlParam = require('../../get-url-parameter')
var ko = require('knockout')
var htmlencode = require('htmlencode')
require('knockout.validation') // No variable here is deliberate!
var ItemOfferer = require('./ItemOfferer')

var ShareOfferModel = function () {
  var self = this
  self.isFormSubmitSuccessful = ko.observable(false)
  self.isFormSubmitFailure = ko.observable(false)

  self.organisations = ko.observableArray()
  self.selectedOrgId = ko.observable()

  self.apiErrors = ko.observableArray()
  self.offer = ko.observable()

  const authClaims = cookies.get('auth-claims')

  self.canShowBroadcastOffer = ko.observable(authClaims === 'SuperAdmin' || authClaims.startsWith('CityAdmin'))

  self.broadcastToOrgs = () => {
    browser.loading()
    var endpoint = self.endpointBuilder.offersOfItems(getUrlParam.parameter('id')).build() + '/broadcast'
    ajax
      .post(endpoint, headers)
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
  }

  ko.validation.init({
    insertMessages: true,
    decorateInputElement: true,
    parseInputAttributes: true,
    errorMessageClass: 'form__error',
    errorElementClass: 'form__input--error'
  }, true)

  const headers = self.headers(cookies.get('session-token'))

  self.submit = function () {
    browser.loading()
    var endpoint = self.endpointBuilder.offersOfItems(getUrlParam.parameter('id')).build() + '/share'
    var payload = {
      'OrgId': self.selectedOrgId().id
    }
    ajax
      .post(endpoint, headers, payload)
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
  }

  const getVolEndpoint = self.endpointBuilder.offersOfItems(getUrlParam.parameter('id')).build()
  ajax
    .get(getVolEndpoint, headers)
    .then((res) => {
      self.offer(new ItemOfferer(res.data))

      browser.loading()
      const getOrgsEndpoint = self.endpointBuilder.publishedOrgs(res.data.person.city).build()
      ajax
        .get(getOrgsEndpoint, headers)
        .then((res) => {
          self.organisations(res.data.map((o) => ({
            'id': o.key,
            'name': htmlencode.htmlDecode(o.name)
          })))

          browser.loaded()
        }, () => {

        })
    }, () => {

    })
}

ShareOfferModel.prototype = new BaseViewModel()

module.exports = ShareOfferModel
