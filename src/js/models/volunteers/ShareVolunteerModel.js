'use strict'

var BaseViewModel = require('../BaseViewModel')
var ajax = require('../../ajax')
var browser = require('../../browser')
var getUrlParam = require('../../get-url-parameter')
var ko = require('knockout')
var htmlencode = require('htmlencode')
require('knockout.validation') // No variable here is deliberate!
var Volunteer = require('./Volunteer')

var ShareVolunteerModel = function () {
  var self = this
  self.isFormSubmitSuccessful = ko.observable(false)
  self.isFormSubmitFailure = ko.observable(false)

  self.organisations = ko.observableArray()
  self.selectedOrgId = ko.observable()

  self.apiErrors = ko.observableArray()
  self.volunteer = ko.observable()

  ko.validation.init({
    insertMessages: true,
    decorateInputElement: true,
    parseInputAttributes: true,
    errorMessageClass: 'form__error',
    errorElementClass: 'form__input--error'
  }, true)

  self.submit = function () {
    browser.loading()
    var endpoint = self.endpointBuilder.volunteers(getUrlParam.parameter('id')).build() + '/share'
    var payload = {
      OrgId: self.selectedOrgId().id
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

  const getVolEndpoint = self.endpointBuilder.volunteers(getUrlParam.parameter('id')).build()
  ajax
    .get(getVolEndpoint)
    .then((res) => {
      self.volunteer(new Volunteer(res.data))

      browser.loading()
      const getOrgsEndpoint = self.endpointBuilder.publishedOrgs(res.data.person.city).build()
      ajax
        .get(getOrgsEndpoint)
        .then((res) => {
          self.organisations(res.data.map((o) => ({
            id: o.key,
            'name': htmlencode.htmlDecode(o.name)
          })))
          browser.loaded()
        }, () => {

        })
    }, () => {

    })
}

ShareVolunteerModel.prototype = new BaseViewModel()

module.exports = ShareVolunteerModel
