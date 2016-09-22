var ko = require('knockout')
var Need = require('../Need')
var BaseViewModel = require('../BaseViewModel')
var browser = require('../../browser')
var adminurls = require('../../admin-urls')
var getUrlParameter = require('../../get-url-parameter')
var ajax = require('../../ajax')
var cookies = require('../../cookies')

function AddServiceProviderNeed () {
  var self = this
  self.need = ko.observable()

  self.saveNeed = function (need) {
    var redirect = adminurls.serviceProviders + '?key=' + getUrlParameter.parameter('providerId')
    browser.redirect(redirect)
  }

  browser.loading()

  var addressEndpoint = self.endpointBuilder.serviceProviders(getUrlParameter.parameter('providerId')).addresses().build()
  ajax.get(addressEndpoint, self.headers(cookies.get('session-token')))
    .then(function (result) {
      let getPostcode = () => {
        if (result.data.addresses !== undefined && result.data.addresses.length > 0) {
          return result.data.addresses[0].postcode
        }
        return ''
      }
      var need = new Need({
        'serviceProviderId': getUrlParameter.parameter('providerId'),
        'postcode': getPostcode()
      })
      need.addListener(self)
      self.need(need)
      browser.loaded()
    }, function (error) {
      self.handleError(error)
    })
}

AddServiceProviderNeed.prototype = new BaseViewModel()

module.exports = AddServiceProviderNeed
