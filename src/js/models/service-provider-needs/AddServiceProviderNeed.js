var ko = require('knockout')
var Need = require('../Need')
var BaseViewModel = require('../BaseViewModel')
var browser = require('../../browser')
var adminurls = require('../../admin-urls')
var getUrlParameter = require('../../get-url-parameter')

function AddServiceProviderNeed () {
  var self = this
  var need = new Need({})
  need.addListener(self)
  self.need = ko.observable(need)

  self.saveNeed = function (need) {
    var redirect = adminurls.serviceProviders + '?key=' + getUrlParameter.parameter('providerId')
    browser.redirect(redirect)
  }
  self.dataLoaded()
}

AddServiceProviderNeed.prototype = new BaseViewModel()

module.exports = AddServiceProviderNeed
