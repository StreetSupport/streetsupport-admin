var cookies = require('../cookies')
var browser = require('../browser')
var adminUrls = require('../admin-urls')

function Index () {
  var self = this
  self.init = function () {
    var authClaims = cookies.get('auth-claims')

    var adminForPrefix = 'AdminFor:'
    var destination

    if (authClaims === null || authClaims === undefined || authClaims.length === 0) {
      destination = adminUrls.login
    } else if (authClaims === 'SuperAdmin') {
      destination = adminUrls.dashboard
    } else if (authClaims.startsWith(adminForPrefix)) {
      destination = adminUrls.serviceProviders + '?key=' + authClaims.substring(adminForPrefix.length)
    }

    browser.redirect(destination)
  }

  self.init()
}

module.exports = Index
