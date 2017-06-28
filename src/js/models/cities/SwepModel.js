const ko = require('knockout')

const ajax = require('../../ajax')
const browser = require('../../browser')
const cookies = require('../../cookies')
const BaseViewModel = require('../BaseViewModel')
const nav = require('../../nav')

const City = function (data) {
  const self = this
  self.key = data.key
  self.name = data.name
  self.userClaims = ko.observable(`cityadminfor:${data.key}`)
  self.swepIsAvailable = ko.observable(data.swepIsAvailable)
  self.buttonText = ko.computed(() => {
    return self.swepIsAvailable()
      ? 'Set Unavailable'
      : 'Set Available'
  }, self)

  self.buttonClass = ko.computed(() => {
    return self.swepIsAvailable()
      ? 'swep-list__button btn btn--warning'
      : 'swep-list__button btn btn--primary'
  }, self)

  self.toggleSwepAvailability = () => {
    browser.loading()

    const endpoint = `${self.endpointBuilder.cities().build()}/${self.key}/swep-status`
    const headers = self.headers(cookies.get('session-token'))
    const data = {
      isAvailable: !self.swepIsAvailable()
    }

    ajax
      .patch(endpoint, headers, data)
      .then((result) => {
        browser.loaded()
        if (result.statusCode !== 200) {
          self.handleError(result)
        } else {
          self.swepIsAvailable(!self.swepIsAvailable())
        }
      }, (_) => {
        self.handleServerError()
      })
  }
}

City.prototype = new BaseViewModel()

const Swep = function () {
  const self = this

  self.cities = ko.observableArray()

  self.init = () => {
    browser.loading()
    ajax
      .get(self.endpointBuilder.cities().build())
      .then((result) => {
        browser.loaded()
        const cities = result.data
          .map((c) => new City(c))
        self.cities(cities)
        nav.disableForbiddenLinks()
      }, (_) => {
        self.handleServerError()
      })
  }
}

Swep.prototype = new BaseViewModel()

module.exports = Swep
