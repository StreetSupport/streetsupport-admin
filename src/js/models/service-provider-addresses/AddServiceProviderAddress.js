var ko = require('knockout')
var Address = require('../Address')
var browser = require('../../browser')
var adminurls = require('../../admin-urls')

function AddServiceProviderAddress () {
  var self = this
  var address = new Address({})
  address.addListener(self)
  self.address = ko.observable(address)

  self.saveAddress = function (address) {
    browser.redirect(adminurls.serviceProviders + '?key=coffee4craig')
  }
}

module.exports = AddServiceProviderAddress
