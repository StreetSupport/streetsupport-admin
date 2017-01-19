const ko = require('knockout')

const ajax = require('../../ajax')
const browser = require('../../browser')
const cookies = require('../../cookies')
const BaseViewModel = require('../BaseViewModel')

const City = function (data) {
  const self = this
  self.key = data.id
  self.name = data.name
  self.swepIsAvailable = ko.observable(data.swepIsAvailable)

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
        if (result.statusCode !== 200) {
          self.handleError(result)
        }
        browser.loaded()
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
      }, (_) => {
        self.handleServerError()
      })
  }
}

Swep.prototype = new BaseViewModel()

module.exports = Swep
