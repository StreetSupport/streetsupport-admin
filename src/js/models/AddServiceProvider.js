const ko = require('knockout')
const ajax = require('../ajax')
const auth = require('../auth')
const adminUrls = require('../admin-urls')
const browser = require('../browser')
const BaseViewModel = require('./BaseViewModel')

import { cities } from '../../data/generated/supported-cities'

function AddServiceProvider () {
  const self = this
  self.name = ko.observable('')
  self.cityId = ko.observable()
  self.cities = ko.observableArray()

  const buildPost = () => {
    const cityId = auth.isCityAdmin()
    ? auth.cityAdminFor()
    : self.cityId()

    const endpoint = self.endpointBuilder.serviceProvidersHAL().build()
    const payload = {
      'Name': self.name(),
      'AssociatedLocations': cityId
    }
    return {
      endpoint,
      payload
    }
  }

  const handlePost = (result) => {
    browser.loaded()
    if (result.statusCode === 201) {
      browser.redirect(adminUrls.dashboard)
    } else {
      self.handleError(result)
    }
  }

  self.save = function () {
    browser.loading()

    const postParams = buildPost()

    ajax
      .post(postParams.endpoint, postParams.payload)
      .then(function (result) {
        handlePost(result)
      }, function (error) {
        self.handleError(error)
      })
  }

  self.cities(cities)
}

AddServiceProvider.prototype = new BaseViewModel()

module.exports = AddServiceProvider
