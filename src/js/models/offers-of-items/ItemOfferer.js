var adminUrls = require('../../admin-urls')
var ajax = require('../../ajax')
const endpoints = require('../../api-endpoints')
var moment = require('moment')
const htmlEncode = require('htmlencode')
var ko = require('knockout')
var browser = require('../../browser')
var BaseViewModel = require('../BaseViewModel')

let ItemOfferer = function (data, listener) {
  const truncate = (text, maxLength, suffix) => {
    if (text.length < maxLength) {
      return text
    }

    return text.substring(0, maxLength) + suffix
  }

  let self = this
  self.listener = listener
  self.id = data.id
  self.person = {
    firstName: data.person.firstName,
    lastName: data.person.lastName,
    email: data.person.email,
    telephone: data.person.telephone,
    postcode: data.person.postcode,
    city: data.person.city
  }
  self.description = data.description
  self.additionalInfo = data.additionalInfo
  self.shortDescription = truncate(data.description, 150, '&hellip;')
  self.shortAdditionalInfo = truncate(data.additionalInfo, 150, '&hellip;')

  self.contactUrl = adminUrls.contactAboutOffer + '?id=' + data.id
  self.creationDate = moment(data.creationDate).format('DD/MM/YY')
  self.isHighlighted = ko.observable(false)
  self.highlighted = ko.computed(() => {
    return self.isHighlighted()
      ? 'volunteer volunteer--highlighted'
      : 'volunteer'
  }, self)

  self.contactHistory = ko.observableArray()
  self.hasContactHistory = ko.observable(false)
  self.hasRetrievedContactHistory = ko.observable(false)

  self.canShare = ko.computed(function () {
    return self.person.city !== null && self.person.city.length > 0
  }, self)
  self.shareUrl = adminUrls.shareOffer + '?id=' + data.id

  self.getContactHistory = () => {
    browser.loading()

    ajax
      .get(
        endpoints.offersOfItems + '/' + self.id + '/contact-requests',
        {})
      .then((result) => {
        let items = result.data.items
        items.forEach((i) => {
          i.message = htmlEncode.htmlDecode(i.message)
          i.createdDate = moment(i.createdDate).format('hh:mm DD/MM/YY')
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
        endpoints.offersOfItems + '/' + self.id + '/is-archived',
        {})
      .then((result) => {
        self.listener.archived(self.id)
        browser.loaded()
      })
  }
}

ItemOfferer.prototype = new BaseViewModel()

module.exports = ItemOfferer
