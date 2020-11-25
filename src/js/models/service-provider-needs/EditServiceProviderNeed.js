const ko = require('knockout')

const adminurls = require('../../admin-urls')
const ajax = require('../../ajax')
const BaseViewModel = require('../BaseViewModel')
const browser = require('../../browser')
const getUrlParameter = require('../../get-url-parameter')
const Need = require('../Need')
const moment = require('moment')
const dateFormat = 'YYYY-MM-DD'

function EditServiceProviderNeed () {
  const self = this
  self.need = ko.observable()
  self.dateFormat = dateFormat
  self.moment = moment
  const providerId = getUrlParameter.parameter('providerId')
  const needId = getUrlParameter.parameter('needId')

  self.providerUrl = ko.observable(`${adminurls.serviceProviders}?key=${providerId}`)
  self.responsesUrl = ko.observable(`${adminurls.needResponses}?needId=${needId}`)

  self.saveNeed = function (need) {
    browser.redirect(`${adminurls.serviceProviders}?key=${need.serviceProviderId}`)
  }

  browser.loading()

  const endpoint = self.endpointBuilder.serviceProviderNeeds(needId).build()

  ajax
    .get(endpoint)
    .then((result) => {
      const need = new Need(result.data)
      need.addListener(self)
      self.need(need)
      browser.loaded()
    }, function (error) {
      self.handleError(error)
    })
}

EditServiceProviderNeed.prototype = new BaseViewModel()

module.exports = EditServiceProviderNeed
