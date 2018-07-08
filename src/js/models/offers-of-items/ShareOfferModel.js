'use strict'

var BaseViewModel = require('../BaseViewModel')
var ajax = require('../../ajax')
var auth = require('../../auth')
var browser = require('../../browser')
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

  self.canShowBroadcastOffer = ko.computed(function () {
    const authClaims = auth.getUserClaims()
    return authClaims.includes('superadmin') || authClaims.includes('cityadmin')
  }, self)

  self.broadcastToOrgs = () => {
    browser.loading()
    var endpoint = self.endpointBuilder.offersOfItems(getUrlParam.parameter('id')).build() + '/broadcast'
    ajax
      .post(endpoint)
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

  self.submit = function () {
    browser.loading()
    var endpoint = self.endpointBuilder.offersOfItems(getUrlParam.parameter('id')).build() + '/share'
    var payload = {
      'OrgId': self.selectedOrgId().id
    }
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
  }

  const getVolEndpoint = self.endpointBuilder.offersOfItems(getUrlParam.parameter('id')).build()
  ajax
    .get(getVolEndpoint)
    .then((res) => {
      self.offer(new ItemOfferer(res.data))

      browser.loading()
      const getOrgsEndpoint = self.endpointBuilder.publishedOrgs(res.data.person.city).build()
      ajax
        .get(getOrgsEndpoint)
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
