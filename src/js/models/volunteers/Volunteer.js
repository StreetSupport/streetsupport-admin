'use strict'

const adminUrls = require('../../admin-urls')
const ajax = require('../../ajax')
const browser = require('../../browser')
const endpoints = require('../../api-endpoints')
const htmlEncode = require('htmlencode')
const BaseViewModel = require('../../models/BaseViewModel')
const moment = require('moment')
const ko = require('knockout')
require('knockout.validation') // No variable here is deliberate!

const Volunteer = function (data, listener) {
  const self = this
  self.id = data.id
  self.listener = listener
  self.person = {
    firstName: data.person.firstName,
    lastName: data.person.lastName,
    email: data.person.email,
    telephone: data.person.telephone,
    postcode: data.person.postcode,
    city: data.person.city
  }
  self.skillsAndExperience = {
    categories: data.skillsAndExperience.categories.join(', '),
    description: data.skillsAndExperience.description
  }
  self.availability = {
    description: data.availability.description
  }
  self.resources = {
    description: data.resources.description
  }

  self.contactUrl = adminUrls.contactVolunteer + '?id=' + data.id
  self.shareUrl = adminUrls.shareVolunteer + '?id=' + data.id
  self.creationDate = moment(data.creationDate).format('DD/MM/YY')
  self.canShare = ko.computed(function () {
    return self.person.city !== null && self.person.city.length > 0
  }, self)

  self.contactHistory = ko.observableArray()
  self.hasContactHistory = ko.observable(false)
  self.hasRetrievedContactHistory = ko.observable(false)

  self.haveSentEmail = ko.observable(false)
  self.shareByEmailFormModel = ko.validatedObservable({
    email: ko.observable().extend({ email: true, required: true })
  })
  self.fieldErrors = ko.validation.group(self.shareByEmailFormModel)

  self.getContactHistory = () => {
    browser.loading()

    ajax
      .get(endpoints.volunteers + '/' + self.id + '/contact-requests')
      .then((result) => {
        const items = result.data.items
        items.forEach((i) => {
          i.message = htmlEncode.htmlDecode(i.message)
          i.createdDate = moment(i.creationDate).format('hh:mm DD/MM/YY')
        })
        self.contactHistory(result.data.items)
        self.hasContactHistory(result.data.items.length > 0)
        self.hasRetrievedContactHistory(true)
        browser.loaded()
      }, (_) => {
        browser.redirect(adminUrls.fiveHundred)
      })
  }

  self.hideContactHistory = () => {
    self.hasRetrievedContactHistory(false)
  }

  self.archive = () => {
    browser.loading()
    ajax
      .patch(
        endpoints.volunteers + '/' + self.id + '/is-archived',
        {})
      .then((result) => {
        self.listener.archived(self.id)
        browser.loaded()
      })
  }
}

Volunteer.prototype = new BaseViewModel()

module.exports = Volunteer
